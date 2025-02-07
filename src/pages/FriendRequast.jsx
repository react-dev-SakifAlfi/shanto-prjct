import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { getDatabase, ref, onValue, remove, set } from "firebase/database";
import { useSelector } from "react-redux";
import { Bounce, toast } from "react-toastify";

const FriendRequast = () => {

  // get data of current user from redux
  const sliseCurrentuser = useSelector((state)=>state.prity.peraDitase)

  

  // to store data state is here
  const [requstdata , uprequstdata] = useState([])


  // firebase database
  const db = getDatabase();

  // real time data from firebase
  useEffect(() => {
    const starCountRef = ref(db, "friendRequastList/");
    onValue(starCountRef, (snapshot) => {
       
       let kamerBAG = []
       snapshot.forEach((namThikama)=>{
       if(namThikama.val().ReseverId == sliseCurrentuser.uid){
        kamerBAG.push({...namThikama.val() , key: namThikama.key})
       }
       })

       uprequstdata(kamerBAG)

    });
  }, []);


    // button funtion
    const deletebutton = (deletedata)=>{
      remove(ref(db, 'friendRequastList/' + deletedata.key))

      toast.error("Friend Requast Delete", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,})
    }
    // button funtion
    const handelConfirmButton = (confirmData)=>{
      
      set(ref(db, 'FrindList/' + confirmData.key) ,{
        currentUserID: sliseCurrentuser.uid,
        currentUserName: sliseCurrentuser.displayName,
        currentUserPhoto: sliseCurrentuser.photoURL,

        ReseverId: confirmData.senderId,
        ReseverName: confirmData.senderName,
        ReseverPhoto: confirmData.senderPhoto,

      })


        remove(ref(db, 'friendRequastList/' + confirmData.key))

        toast.success("you both are friend new", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
    }
 

  return (
    <>
      <Navbar />
      <div className=" md:min-h-screen h-full w-[300px] md:w-[900px] bg-gradient-to-r from-[#71ffe3] via-[#fff] to-[#008cff] flex flex-col items-center py-10">
        <h2 className="text-3xl font-bold text-black w-full text-center pt-5 pb-5 mb-8 shadow-lg">
          All User
        </h2>
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-lg p-6">
        {
          requstdata.map((SOBdata)=>(
            <div key={SOBdata.key} className="UserPage flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-100 transition duration-300 ease-in-out rounded-lg">
            <div className="flex items-center">
              <img
                src={SOBdata?.senderPhoto}
                alt="profile"
                className="md:w-14 w-[30px] h-[30px] md:h-14 rounded-full object-cover border-2 border-purple-500 shadow-sm"
              />
              <span className="ml-5 text-gray-800 font-semibold text-[12px] md:text-lg">
                {SOBdata?.senderName}
              </span>
            </div>
            <div className="flex buttoUser gap-1 md:gap-3">
              <button
              onClick={()=>handelConfirmButton(SOBdata)}
               className="bg-gradient-to-r from-[#49e751] to-[#0f8] active:scale-95 text-white md:px-5 px-2 md:py-2 py-0 md:text-[18px] text-[12px] rounded-full shadow-lg hover:from-[#0f8] hover:to-[#49e751] transform hover:scale-105 transition duration-300 ease-in-out">
                Confirm
              </button>
              <button onClick={()=>deletebutton(SOBdata)} className="bg-gradient-to-r from-[#f00] to-[#ff00aa] active:scale-95 text-white md:px-5 px-2 md:py-2 py-0 md:text-[18px] text-[12px] rounded-full shadow-lg hover:from-[#ff00aa] hover:to-[#f00] transform hover:scale-105 transition duration-300 ease-in-out">
                Delete
              </button>
            </div>
          </div>
          ))
        }
          
        </div>
      </div>
    </>
  );
};

export default FriendRequast;
