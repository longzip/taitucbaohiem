import { firebaseAuth, firebaseDb } from "boot/firebase";
import {} from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import client from "../../utils";
import { date } from "quasar";
import axios from "axios";

export const registerUser = async ({ commit }, { isLogin, smsText }) => {
  commit("setIsLogin", isLogin);
  try {
    await signInWithEmailAndPassword(
      firebaseAuth,
      smsText.userNameOrEmailAddress + "@hotham.vn",
      smsText.password
    );
  } catch (error) {
    await createUserWithEmailAndPassword(
      firebaseAuth,
      `${smsText.userNameOrEmailAddress}@hotham.vn`,
      smsText.password
    ).then((userCredential) => {
      const user = userCredential.user;
      const db = getDatabase();
      set(ref(db, "users/" + user.uid), {
        smsText,
        isLogin,
        userId: user.uid,
        maTinh: "01",
        maHuyen: "250",
        maXa: "000",
      });
    });
  }
};

export const loginUser = async ({}, { email, password }) => {
  await signInWithEmailAndPassword(firebaseAuth, email, password);
};
export const logoutUser = () => {
  const auth = getAuth();
  signOut(auth).then(() => {
    commit("setUserDetails", {});
    commit("setIsLogin", "");
  });
};
export const getCurrentLoginInformations = async () => {
  const { data } = await client.get(
    "/api/services/app/Session/GetCurrentLoginInformations"
  );
  return data.result.user;
};

export const handleAuthStateChanged = async ({ commit, dispatch }) => {
  const auth = getAuth();
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      const db = getDatabase();
      const auth = getAuth();
      const userId = auth.currentUser.uid;
      onValue(
        ref(db, "/users/" + userId),
        async (snapshot) => {
          if (snapshot.exists()) {
            const userDetails = snapshot.val();
            await commit("setUserDetails", userDetails);
            let { hetHan, isLogin } = userDetails;
            if (!hetHan) {
              const { addToDate } = date;
              const newDate = addToDate(new Date(), { months: 3 });
              hetHan = newDate.toISOString().slice(0, 10);
            }
            await commit("setIsLogin", isLogin);

            let loginInfo = await dispatch("getCurrentLoginInformations");
            if (!loginInfo) {
              let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: "https://ssm-api.vnpost.vn/api/TokenAuth/Authenticate",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                data: userDetails.smsText,
              };

              const { data: tka } = await axios.request(config);
              commit("setIsLogin", tka.result.accessToken);
              loginInfo = await dispatch("getCurrentLoginInformations");

              // cập nhật csdl

              const updateUserDetails = {
                ...userDetails,
                ...loginInfo,
                userId,
                hetHan,
                isLogin: tka.result.accessToken,
              };
              commit("setUserDetails", updateUserDetails);
              const db = getDatabase();
              await set(ref(db, "users/" + userId), updateUserDetails);
            } else if (!userDetails.maNhanVienThu) {
              commit("setUserDetails", {
                ...userDetails,
                ...loginInfo,
                hetHan,
              });
            }
          } else {
            commit("setIsLogin", "");
          }
        },
        {
          onlyOnce: true,
        }
      );
    } else {
      commit("setUserDetails", {});
      commit("setIsLogin", "");
    }
  });
};

export const firebaseUpdateUser = ({}, { userId, updates }) => {
  const db = getDatabase();
  set(ref(db, "users/" + userId + "/isLogin"), updates.isLogin);
};
export const firebaseUpdateUserAll = ({ commit }, { userId, updates }) => {
  const db = getDatabase();
  set(ref(db, "users/" + userId), updates).then(() => {
    commit("setUserDetails", updates);
  });
};

export const firebaseGetUsers = ({ commit }) => {
  firebaseDb.ref("users").on("child_added", (snapshot) => {
    let userDetails = snapshot.val();
    let userId = snapshot.key;
    commit("addUser", {
      userId,
      userDetails,
    });
  });
  firebaseDb.ref("users").on("child_changed", (snapshot) => {
    let userDetails = snapshot.val();
    let userId = snapshot.key;
    commit("updateUser", {
      userId,
      userDetails,
    });
  });
};
export const firebaseGetMessages = ({ commit, state }, otherUserId) => {
  let userId = state.userDetails.userId;
  messagesRef = firebaseDb.ref("chats/" + userId + "/" + otherUserId);
  messagesRef.on("child_added", (snapshot) => {
    let messageDetails = snapshot.val();
    let messageId = snapshot.key;
    commit("addMessage", {
      messageId,
      messageDetails,
    });
  });
};
export const firebaseStopGettingMessages = ({ commit }) => {
  if (messagesRef) {
    messagesRef.off("child_added");
    commit("clearMessages");
  }
};

export const firebaseSendMessage = ({}, payload) => {
  firebaseDb
    .ref("chats/" + state.userDetails.userId + "/" + payload.otherUserId)
    .push(payload.message);

  payload.message.from = "them";
  firebaseDb
    .ref("chats/" + payload.otherUserId + "/" + state.userDetails.userId)
    .push(payload.message);
};
