/* ---------------- PAGE CONTROL ---------------- */
function goNext(step) {
  if (!validate(step - 1)) return;
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById("step" + step).classList.add("active");
}

function goPrev(step) {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById("step" + step).classList.add("active");
}

function showError(id, msg) {
  document.getElementById(id + "_error").innerText = msg;
}

/* ---------------- VALIDATION ---------------- */
function validate(step) {
  if (step === 1 && !document.getElementById("acceptTerms").checked) {
    showError("acceptTerms", "এটি বাধ্যতামূলক");
    return false;
  }
  if (step === 2 && document.getElementById("teamName").value.trim() === "") {
    showError("teamName", "দলের নাম দিন");
    return false;
  }
  showError("acceptTerms", "");
  showError("teamName", "");
  return true;
}

/* ---------------- FIREBASE ---------------- */
const firebaseConfig = {
  apiKey: "AIzaSyBl0PIm4lvZea96Bte3KaKQJvurGE1P8Es",
            authDomain: "noreply@post-c7e41.firebaseapp.com",
            databaseURL: "https://post-c7e41-default-rtdb.firebaseio.com",
            projectId: "post-c7e41",
            messagingSenderId: "758133068153",
            appId: "1:758133068153:web:28ef27e45d8037e0d49fa8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

/* ---------------- BASE64 ---------------- */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) resolve(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/* ---------------- SUBMIT ---------------- */
async function handleSubmit() {
  if (!document.getElementById("finalConfirm").checked) {
    showError("finalConfirm", "নিশ্চিত করুন");
    return;
  }
  showError("finalConfirm", "");

  const teamLogoFile = document.getElementById("teamLogo").files[0];
  const ytFile = document.getElementById("yt_ss").files[0];
  const fbFile = document.getElementById("fb_ss").files[0];

  const teamLogoBase64 = await toBase64(teamLogoFile);
  const ytBase64 = await toBase64(ytFile);
  const fbBase64 = await toBase64(fbFile);

  const data = {
    teamName: document.getElementById("teamName").value,
    teamType: document.getElementById("teamType").value,
    captainReal: document.getElementById("captainReal").value,
    captainPhone: document.getElementById("captainPhone").value,
    players: {
      p1: { ign: document.getElementById("p1_ign").value, uid: document.getElementById("p1_uid").value },
      p2: { ign: document.getElementById("p2_ign").value, uid: document.getElementById("p2_uid").value },
      p3: { ign: document.getElementById("p3_ign").value, uid: document.getElementById("p3_uid").value },
      p4: { ign: document.getElementById("p4_ign").value, uid: document.getElementById("p4_uid").value },
      sub: document.getElementById("sub_info").value
    },
    teamLogo: teamLogoBase64,
    yt_ss: ytBase64,
    fb_ss: fbBase64,
    time: Date.now()
  };

  await db.collection("registrations").add(data);

  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.getElementById("done").classList.add("active");
}