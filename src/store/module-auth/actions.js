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

export const registerUser = async ({ commit }, payload) => {
  createUserWithEmailAndPassword(
    firebaseAuth,
    `${payload.smsText.userNameOrEmailAddress}@hotham.vn`,
    payload.smsText.password
  ).then((userCredential) => {
    const user = userCredential.user;
    const db = getDatabase();
    set(ref(db, "users/" + user.uid), payload);
  });
};

export const loginUser = async ({}, { email, password }) => {
  await signInWithEmailAndPassword(firebaseAuth, email, password);
};
export const logoutUser = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      commit("setUserDetails", {});
      commit("setIsLogin", "");
    })
    .catch((error) => {
      // An error happened.
    });
};
export const getCurrentLoginInformations = async () => {
  const { data } = await client.get(
    "/api/services/app/Session/GetCurrentLoginInformations"
  );
  return data.result.user;
};
export const handleAuthStateChanged = async ({ commit, dispatch, state }) => {
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
            commit("setIsLogin", userDetails.isLogin);
            //kiểm tra khóa
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
            }
            let { hetHan } = userDetails;
            if (!hetHan) {
              const { addToDate } = date;
              const newDate = addToDate(new Date(), { months: 3 });
              hetHan = newDate.toISOString().slice(0, 10);
            }

            const updateUserDetails = {
              ...userDetails,
              ...loginInfo,
              userId,
              hetHan,
            };
            commit("setUserDetails", updateUserDetails);
            const db = getDatabase();
            set(ref(db, "users/" + userId), updateUserDetails);
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

export const firebaseUpdateUser = (
  {},
  { userId = "Tb2NycH5FvRMZmkID4meXAHHsQR2", updates }
) => {
  const db = getDatabase();
  set(ref(db, "users/" + userId + "/isLogin"), updates.isLogin).then(() => {
    console.log("cap nhat");
  });
};
export const firebaseUpdateUserAll = (
  {},
  { userId = "Tb2NycH5FvRMZmkID4meXAHHsQR2", updates }
) => {
  const db = getDatabase();
  set(ref(db, "users/" + userId), updates).then(() => {
    console.log("cap nhat all");
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
