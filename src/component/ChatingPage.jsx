import React, { useEffect, useState } from "react";
import Navbar from "../pages/Navbar";
import { IoIosArrowBack } from "react-icons/io";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { SliceUserChat } from "../Slices/SliceForChat";
import { PiPaperPlaneRightFill } from "react-icons/pi";

const ChatingPage = () => {
  // for chating page
  const [one, tow] = useState(true);
  const [onenav, townave] = useState(false);

  const trinayCahtPage = () => {
    tow(!one);
    townave(!onenav);
  };

  // data frome rudex

  const SliceUser = useSelector((state) => state.prity.peraDitase);
  // state for work with firebasw data

  const [UserFiends, upUserFriend] = useState([]);

  console.log(UserFiends);

  // firebse variabals

  const db = getDatabase();

  useEffect(() => {
    const starCountRef = ref(db, "FrindList/");
    onValue(starCountRef, (snapshot) => {
      let bag = [];
      snapshot.forEach((oxox) => {
        if (oxox.val().ReseverId == SliceUser.uid) {
          bag.push({
            key: oxox.val().key,
            userId: oxox.val().currentUserID,
            userName: oxox.val().currentUserName,
            userPhoto: oxox.val().currentUserPhoto,
          });
        } else if (oxox.val().currentUserID == SliceUser.uid) {
          bag.push({
            key: oxox.key,
            userId: oxox.val().ReseverId,
            userName: oxox.val().ReseverName,
            userPhoto: oxox.val().ReseverPhoto,
          });
        }
      });
      upUserFriend(bag);
    });
  }, []);

  // sent data to redux

  const dispatch = useDispatch();

  const sentdatatoredux = (UserChatData) => {
    dispatch(SliceUserChat(UserChatData));
    localStorage.setItem("UserInformetion", JSON.stringify(UserChatData));
  };

  //  and tekeing back UserInformetion frome redux to display

  const userInfoFormRedux = useSelector(
    (state) => state.UserChat.ChatUserSlice
  );

  // on going message
  const [ongoingMessage, UPongoingMessage] = useState("");

  // incomeing message
  const [incomeinggMessage, UPincomeingMessage] = useState([]);

  console.log(ongoingMessage);

  // send masg
  const send = () => {
    console.log("send hoise");
    set(push(ref(db, "Message/")), {
      senderId: SliceUser.uid,
      reseverId: userInfoFormRedux.userId,
      message: ongoingMessage,
      messageTime: formatAMPM(new Date),
    });
    UPongoingMessage("");
  };

  const enter = (e) => {
    console.log(e.key);
    if (e.key == "Enter") {
      send();
    }
  };

  useEffect(() => {
    const starCountRef = ref(db, "Message/" );
    onValue(starCountRef, (snapshot) => {
      let bag = []
      snapshot.forEach((MSGdata)=>{
        if( MSGdata.val().senderId == SliceUser.uid && MSGdata.val().reseverId == userInfoFormRedux.userId){
          bag.push({...MSGdata.val() , key:MSGdata.key})
        }
        else if(MSGdata.val().reseverId == SliceUser.uid && MSGdata.val().senderId == userInfoFormRedux.userId){
          bag.push({...MSGdata.val() , key:MSGdata.key})
        }
      })
      UPincomeingMessage(bag)
      
    });
  }, [userInfoFormRedux]);



  // ===========time
  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }


  console.log(formatAMPM(new Date));
  // ===========time
  // ReseverId ReseverName ReseverPhoto  currentUserName  currentUserPhoto currentUserID

  return (
    <>
      {onenav ? "" : <Navbar />}
      <div className="flex bg-[#00000048] w-full md:h-[100vh]   ">
        <div className="divflex h-[100vh] ">
          <div
            className={`w-[320px] ${
              one ? "chatPageC" : "chatPage"
            } chats  md:ml-[70px] overflow-y-scroll py-10`}
          >
            {/* map this */}

            {UserFiends.map((wewe) => (
              <div
                key={wewe?.key}
                onClick={() => sentdatatoredux(wewe)}
                className=""
              >
                <button
                  onClick={trinayCahtPage}
                  className=" w-full h-[50px] mt-5  bg-[#56565670] rounded-3xl "
                >
                  <div className="flex gap-10 items-center pl-1">
                    <div className=" w-10 h-10 overflow-hidden rounded-full bg-green-600 ">
                      <img
                        className=" w-10 h-10  "
                        src={wewe?.userPhoto}
                        alt="user"
                      />
                    </div>
                    <h2 className="text-white font-medium ">
                      {wewe?.userName}{" "}
                    </h2>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ============ */}

        <div className="divtoFlex  ">
          <div
            className={`w-[320px] md:w-[950px]  ${
              one ? "chatPage" : "chatPageC"
            } h-[100vh] blurchat`}
          >
            <div className="w-full md:h-[90px] text-white flex gap-10 pl-2 pt-2 md:pl-4 md:pt-4 items-center ">
              <div className=" md:w-20 w-10 h-10  md:h-20 rounded-full overflow-hidden bg-[#000]">
                <img
                  className="w-full"
                  src={userInfoFormRedux?.userPhoto}
                  alt=""
                />
              </div>
              <h4 className=" text-[20px] font-medium ">
                {" "}
                {userInfoFormRedux?.userName}{" "}
              </h4>
            </div>
            <div onClick={trinayCahtPage} className=" pl-2 pt-5 md:hidden ">
              {" "}
              <IoIosArrowBack className="text-white text-[30px] " />
            </div>

            <div className="chatBox w-full h-[490px] md:h-[630px] relative flex flex-col justify-between gap-4 ">
              <div className=" w-full h-[500px] overflow-y-scroll py-5">
                {/* resever msg */}
               
                {/* sender msg */}


                {
                  incomeinggMessage.map((kotha)=>(
                    kotha.senderId == SliceUser.uid ?
                  <div key={kotha.key} className="sentData bg-[#18d1ff2c] w-[150px] md:w-fit md:text-[15px] text-[10px] ml-[50%] py-2 px-5 rounded-xl text-white border ">
                    <div className="">
                    <p>{kotha?.message}</p>
                    <p>{kotha?.messageTime}</p>
                    </div>
                  </div> : 
                   <div className="resiveData w-[150px] md:w-[400px] text-[10px] md:text-[15px] ml-[2%] py-2 px-5 rounded-xl text-white border ">
                   <div className="">
                    <p>{kotha?.message}</p>
                    <p>{kotha?.messageTime}</p>
                    </div>
                 </div>
 
                    ))
                    
                }
                



              </div>

              {/* text box */}
              <div className=" px-2 md:px-10  h-[50px] pb-0 md:pb-5 md:h-[70px] relative ">
                <input
                  value={ongoingMessage}
                  onChange={(e) => UPongoingMessage(e.target.value)}
                  onKeyDown={(e) => enter(e)}
                  className="w-full md:bg-[#0000006e] h-full outline-none bg-transparent text-white border md:border-[2px] px-1 md:px-3  rounded-full  "
                  type="text"
                  placeholder=" your message"
                />
                <button onClick={send}>
                  <PiPaperPlaneRightFill className="text-white text-[25px] active:scale-90 hover:scale-110 transition-all absolute md:top-[12px] md:right-[60px] top-[10px] right-[20px] " />
                </button>
              </div>
              {/* text box */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatingPage;
