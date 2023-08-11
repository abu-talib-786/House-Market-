import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
    const location = useLocation()
    const navigate = useNavigate()

    const onGoogleClick = async () => {
        try {
            const Auth = getAuth()
            const provider = new GoogleAuthProvider()
            const result = signInWithPopup(Auth, provider)
            const user = result.user

            // check for user
            const docRef = doc(db, 'user', user.uid)
            const docSnap = await getDoc(docRef)

            // if not user , create user
            if (!docSnap.exists()) {
                await setDoc(doc(db, 'user', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()

                })
            }
            navigate('/')
        } catch (error) {
            toast.error('Could not authorize with google')            
        }
    }

  return (
        <div className="socialLogin">
            <p>Sign {location.pathname === '/sign-up' ? 'up' : 'in'} With</p>
            <button className="socialIconDiv" onClick={onGoogleClick}>
                <img className="socialIconImg" src={googleIcon} alt="google" />
            </button>
        </div>
  )
}

export default OAuth
