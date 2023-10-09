import React, { useContext, useState } from 'react'
import Attach from "../images/attach.png"
import AddImg from "../images/add_img.png"
import Send from "../images/send.png"
import { ChatContext } from '../context/ChatContext'
import { AuthContext } from '../context/AuthContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import { v4 as uuid } from "uuid"
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { updateProfile } from 'firebase/auth'


const Input = () => {

  const [text, setText] = useState("")
  const [img, setImg] = useState(null)

  const { currentUser } = useContext(AuthContext)
  const { data } = useContext(ChatContext)

  const handleSend = async () => {
    if (img) {

      const storageRef = ref(storage, uuid());

      await uploadBytesResumable(storageRef, img).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {

            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });

          } catch (err) {
            alert("Error!")
          }
        });
      });

    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp()
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text
      },
      [data.chatId + ".date"]: serverTimestamp()
    });

    setText("")
    setImg(null)

  };

  return (
    <div className='input'>
      <input type="text" 
      placeholder='Type something!' 
      onChange={e => setText(e.target.value)} 
      value={text}
      />
      <div className="send">
        <input type="file" style={{ display: "none" }} id='file' onChange={e => setImg(e.target.files[0])} />
        <label htmlFor="file">
          <img className='AddImg' src={AddImg} alt="" />
        </label>
        <button><img className='Send' src={Send} alt="" onClick={handleSend} /></button>
      </div>
    </div>
  )
}

export default Input