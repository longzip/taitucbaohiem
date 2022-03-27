import { firebaseAuth, firebaseDb } from "boot/firebase";
import {} from "firebase/auth";
import { getDatabase, ref, set, onValue } from "firebase/database";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const registerUser = ({}, payload) => {
  firebaseAuth
    .createUserWithEmailAndPassword(
      firebaseAuth,
      payload.email,
      payload.password
    )
    .then((response) => {
      console.log(response);
      let userId = firebaseAuth.currentUser.uid;
      firebaseDb.ref("users/" + userId).set({
        name: payload.name,
        email: payload.email,
        online: true,
      });
    })
    .catch((error) => {
      console.log(error.message);
    });
};

export const loginUser = ({}, { email, password }) => {
  signInWithEmailAndPassword(firebaseAuth, email, password);
  // .then((userCredential) => {
  //   // Signed in
  //   const user = userCredential.user;
  //   console.log(user);
  //   // ...
  // })
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  // });
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
export const handleAuthStateChanged = async ({ commit, dispatch, state }) => {
  const auth = getAuth();
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const db = getDatabase();
      const auth = getAuth();

      const userId = auth.currentUser.uid;
      onValue(
        ref(db, "/users/" + userId),
        (snapshot) => {
          if (snapshot.exists()) {
            let userDetails = snapshot.val();
            commit("setUserDetails", {
              name: userDetails.name,
              email: userDetails.email,
              smsText: userDetails.smsText,
              isLogin: userDetails.isLogin,
              userId,
            });
            commit("setIsLogin", userDetails.isLogin);
          } else {
            console.log("No data available");
            console.log(user);
            commit("setUserDetails", {
              name: user.displayName,
              email: user.email,
              userId: user.uid,
            });
            const db = getDatabase();
            set(ref(db, "users/" + userId), {
              name: user.displayName,
              email: user.email,
              userId: user.uid,
            });
            commit("setIsLogin", "");
          }
        },
        {
          onlyOnce: true,
        }
      );
    } else {
      // User is signed out
      // dispatch("firebaseUpdateUser", {
      //   userId: state.userDetails.userId,
      //   updates: {
      //     online: false,
      //   },
      // });
      commit("setUserDetails", {});
      commit("setIsLogin", "");
    }
  });
};

export const firebaseUpdateUser = ({}, { userId, updates }) => {
  if (userId) {
    const db = getDatabase();
    set(ref(db, "users/" + userId), updates);
  }
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
