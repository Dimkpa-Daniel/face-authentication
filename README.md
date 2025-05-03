
# 🔐 Face Authentication System with React, Next.js, Firebase & FaceAPI

A secure and fast facial recognition authentication system built with **Next.js**, **Firebase Firestore**, and **FaceAPI.js**. Users can register and log in using their face via webcam input.

---

## 🚀 Features

- User registration with facial scan and email
- Secure face descriptor comparison during login
- Real-time webcam feed using `react-webcam`
- State management via `Jotai`
- Facial recognition using `face-api.js`
- Feedback with `react-toastify`
- Firebase Firestore to store users and descriptors

---

## 🛠️ Technologies Used

| Tech              | Purpose                              |
|-------------------|---------------------------------------|
| Next.js           | Framework for server-side React apps |
| Firebase Firestore| NoSQL DB for user data & descriptors |
| face-api.js       | Facial detection and recognition     |
| react-webcam      | Webcam integration in React          |
| Jotai             | Global state management               |
| React Toastify    | Toast-based notifications             |

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Dimkpa-Daniel/face-authentication.git
cd face-authentication
````

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

---

## 🔐 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project.
3. Enable Firestore in the Firebase console.
4. Copy your Firebase config (`apiKey`, `authDomain`, etc.)

### Create a `.env.local` file

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 🔥 Firebase Rules (Recommended)

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /faceUsers/{userId} {
      allow read, write: if true; // Replace with actual auth logic if needed
    }
  }
}
```

---

## 🧠 Facial Recognition Notes

* Descriptors are 128-dimension float arrays representing facial features.
* Averaged descriptor from multiple frames increases accuracy.
* Threshold of `0.6` used for matching faces.

---

## 📁 Project Structure

```bash
.
├── components/
│   ├── CustomInputField.tsx     # Reusable input field
│   └── WebcamFeed.tsx           # Scanner view
├── pages/
│   ├── login.tsx                # Face-based login
│   ├── index.tsx                # Face-based registration
│   └── dashboard.tsx            # Logged-in homepage
├── atoms/state.ts               # Jotai atoms
├── lib/
│   ├── faceUtils.ts             # Facial recognition logic
│   └── firebase.ts              # Firebase initialization
├── styles/                      # Global styles
├── utils/
│   ├── faceUtilsHelper.ts       # Average descriptor logic
├── public/models/               # FaceAPI models (see below)
└── .env.local                   # Firebase credentials
```

---

## 🧠 Model Files Setup for `face-api.js`

Download these models and place in `public/models`:

* `tiny_face_detector_model-weights_manifest.json`
* `face_landmark_68_model-weights_manifest.json`
* `face_recognition_model-weights_manifest.json`

📥 You can get them from:
[https://github.com/justadudewhohacks/face-api.js-models](https://github.com/justadudewhohacks/face-api.js-models)

> The app automatically loads models from `/models` during scanning.

---

## 🧪 Testing

* Register with your face and a unique email.
* Attempt login with matching face — should succeed.
* Attempt login with another person's face — should fail.

---

## ✨ Future Improvements

* Add liveness detection (e.g., blink detection)
* Add 2FA for extra security
* Store descriptors securely with encryption
* Improve UI/UX with better scan indicators



---

## 🙋‍♂️ Author

Built by [Dimkpa Daniel](https://github.com/Dimkpa-Daniel)


