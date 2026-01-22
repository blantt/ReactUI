import React, { useState,useRef } from 'react';
import AppTitle from '../component/header';
// import { Button2 } from "../component/button.tsx";
import { DiscordIcon, AnotherIcon, AnotherIcon2 } from "../component/mySvg";
import { Button2, TextInput } from "../component/simpleUI";


// 想建一個類別,裡面有參數,在迴圈中使用,每一個迴圈會new它,再給它值

const App: React.FC = () => {

   const audioRef = useRef<HTMLAudioElement>(null);

    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

//    'Test_TeacherID = "10044"
//    'ExamID = "4102"
//    'Type = "practice"
//    'RandTest = True
//    'RandChoose = False
//    'NewGEPT = "y"
//    'Level = "a"


    let test_TeacherID = "";
    let test_ScoreID = "";
    let test_TestDetailID = "";
    let test_ExamID = "";
    let test_Type = "practice";
    let test_RandTest = true;
    let test_RandChoose = false;
    let test_NewGEPT = "y";
    let test_Level = "a";
 

    test_ExamID = "4102";
    //莎士比亞反應問題: "ScoreID^=^22386;Test_TeacherID^=^5034"
    test_TeacherID = "10044";
    test_ScoreID = "";
    test_TestDetailID = "1194752";  

    //1194752 文意填選
     

    const [jsonData, setJsonData] = useState<any[]>([]); // 儲存 JSON 陣列
    const [loading, setLoading] = useState(false);
    const [teachId, setTeachId] = useState(test_TeacherID); // State for teachId
    const [ScoreID, setScoreID] = useState(test_ScoreID); // State for examId
    const [TestDetailID, setTestDetailID] = useState(test_TestDetailID);
    const [ExamID, setExamID] = useState(test_ExamID);


         function callapi() {
    
            const fetchData = async () => {
            // api 傳入的必要參數:  Test_TeacherID,ExamID,Type,RandTest,RandChoose,NewGEPT,Level
                try {
                       
                  // alert('開始呼叫 api');
                    const url = "http://localhost:61625/apitest/HandlerApiTest.ashx?func=getTestActivity";
                    // const url = `http://localhost:61625/apitest/HandlerApiTest.ashx?func=getTestActivity;
                   let apiUrl = [
                        `${url}&TeacherID=${encodeURIComponent(teachId)}`,
                        `ExamID=${encodeURIComponent(ExamID)}`,
                        `Type=${encodeURIComponent(test_Type)}`,
                        `RandTest=${encodeURIComponent(String(test_RandTest))}`,
                        `RandChoose=${encodeURIComponent(String(test_RandChoose))}`,
                        `NewGEPT=${encodeURIComponent(test_NewGEPT)}`,
                        `TestDetailID=${encodeURIComponent(TestDetailID)}`,
                        `Level=${encodeURIComponent(test_Level)}`
                        ].join('&');
                 //   console.log('apiUrl=' + apiUrl);
                  // alert('apiUrl=' + apiUrl);
                   const response = await fetch(apiUrl);
    
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    //   alert('api 呼叫成功');
                    //   const text = await response.text();
                    //   alert('API 呼叫成功，回傳資料: ' + text);
    
                    const data = await response.json();
                    let parsedData;
                    if (typeof data === 'string') {
                        parsedData = JSON.parse(data);
                    } else {
                        parsedData = data;
                    }
                    // 判斷是否為 JSON 陣列
                    if (Array.isArray(parsedData)) {
                        setJsonData(parsedData); // 儲存 JSON 陣列
                       // alert('parsedData 成功');
                    } else {
                        throw new Error('資料格式錯誤，應為 JSON 陣列');
                    }


                     
                } catch (error) {
                    console.error('Error fetching data:', error);
                    alert('資料取得失敗dd' + error);
                }
            };
            fetchData();
    
        } 
    


    function callotc() {

        const fetchData = async () => {
            //https://clockappservice.english4u.com.tw/api/testdb/SelectTestRecordAnalyze_v1_2?TeacherID=5034&ScoreID=22386&TestDetailID=453224
            const url = "https://clockappservice.english4u.com.tw/api/testdb/SelectTestRecordAnalyze_v1_2";
            setLoading(true);
            try {
                // Use teachId and examId values
                // alert("Teach ID: " + teachId);
                // alert("Exam ID: " + ScoreID);

                if (!teachId || !ScoreID) {
                    alert("請輸入 TeacherID 和 ScoreID");
                    return;
                }

                let apiUrl = "";

                apiUrl = `${url}?TeacherID=${encodeURIComponent(teachId)}&ScoreID=${encodeURIComponent(ScoreID)}`;
                // 如果有 TestDetailID，則加入到 URL 中
                if (TestDetailID) {
                    apiUrl += `&TestDetailID=${encodeURIComponent(TestDetailID)}`;
                }

                const response = await fetch(apiUrl);
                if (!response.ok) {
                    alert(`HTTP error! status: ${response.status}`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                let parsedData;
                if (typeof data === 'string') {
                    parsedData = JSON.parse(data);
                } else {
                    parsedData = data;
                }
                // 判斷是否為 JSON 陣列
                if (Array.isArray(parsedData)) {
                    setJsonData(parsedData); // 儲存 JSON 陣列
                } else {
                    throw new Error('資料格式錯誤，應為 JSON 陣列');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('資料取得失敗' + error);
            }
        };
        fetchData();

    }

   

    return (
        <div>
               <h3>考題測驗</h3>
            <div className="space-x-4 flex items-center ">

                <TextInput placeholder="Test_TeacherID"
                    value={teachId}
                    onChange={(e) => setTeachId(e.target.value)} >
                </TextInput>

                <TextInput placeholder="ExamID"
                    value={ExamID}
                    onChange={(e) => setExamID(e.target.value)} >
                </TextInput>

                <TextInput placeholder="TestDetailID"
                    value={TestDetailID}
                    onChange={(e) => setTestDetailID(e.target.value)} >
                </TextInput>

                <Button2 label="測試結果" icon={<DiscordIcon />} onClick={() => callotc()} />

                  <Button2 label="開始測驗api"  onClick={() => callapi()} />
 
            </div>

            {jsonData.map((item, index) => {
                const ClassItem = new ShowField_GEPT(item);
                //console.log(ClassItem); // 檢查實例

                return (
                    <div key={index} className="p-4 border rounded shadow">
                        <pre className="text-sm bg-gray-100 p-2 rounded">
                            <div>
                                <div>
                                    {index} - {ClassItem.Category2} - {ClassItem.TestDetailID}
                                </div>
                                 <div>
                                    {'Question_Audio'}:{ClassItem.Question_Audio} ,{'Question_Major_Audio'}:{ClassItem.Question_Major_Audio} 
                                </div>
                                
                            </div>
                            <div className="bg-slate-300">
                                {"TestTypeMain:"}-{ClassItem.TestTypeMain},{' '}
                                {"TestTypeOrigin:"}-{ClassItem.TestTypeOrigin}
                            </div>
                            <div className="flex justify-center">
                                {ClassItem.UI_Question_Image && (
                                    <div>
                                        <img
                                            id="Question_Image"
                                            src={`/test/${ClassItem.Question_Image}`}
                                            alt="Example"
                                        />
                                    </div>
                                )}


                            </div>
                            <div>
                               
                                <div>
                                     {/* 音檔的控制,目前先用欄位是否存在,來決定是否顯示,感覺可以,但原碼不是這樣判斷,再觀察 */}
                                    {ClassItem.Question_Audio && (
                                        <div>
                                            <audio id="Question_Audio" ref={audioRef} controls preload="none">
                                                <source src={`/test/${ClassItem.Question_Audio}`} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    )}
                                    {ClassItem.Question_Major_Audio && (
                                        <div>
                                            <audio id="Question_Audio" ref={audioRef} controls preload="none">
                                                <source src={`/test/${ClassItem.Question_Major_Audio}`} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        </div>
                                    )}
                                    <div>
                                        <button onClick={playAudio}>Play</button>
                                        <button onClick={pauseAudio}>Pause</button>
                                    </div>
                                </div>

                                {ClassItem.UI_Question1 && (
                                    <div>
                                        {"問:"} - {ClassItem.Question}
                                    </div>
                                )}
                            </div>
                            <div>
                                {ClassItem.UI_Question2 && (
                                    <div>
                                        {"問:"} - {ClassItem.Question}
                                    </div>
                                )}
                            </div>
                            <div>
                                {ClassItem.UI_Choose1 && (
                                    <div>
                                        {"A:"} - {ClassItem.Choose1}
                                    </div>
                                )}
                            </div>
                            <div>
                                {ClassItem.UI_Choose2 && (
                                    <div>
                                        {"B:"} - {ClassItem.Choose2}
                                    </div>
                                )}
                            </div>
                            <div>
                                {ClassItem.UI_Choose3 && (
                                    <div>
                                        {"C:"} - {ClassItem.Choose3}
                                    </div>
                                )}
                            </div>
                            <div>
                                {ClassItem.UI_Choose4 && (
                                    <div>
                                        {"D:"} - {ClassItem.Choose4}
                                    </div>
                                )}
                            </div>

                            <div>
                                <h6>{"正解:"} {ClassItem.Answer}</h6>
                                <h6>{"user:"} {ClassItem.UserAnswer}</h6>
                                <h6>
                                    {ClassItem.Answer === ClassItem.UserAnswer ? (
                                        <span style={{ color: "green" }}>正確</span>
                                    ) : (
                                        <span style={{ color: "red" }}>錯誤</span>
                                    )}
                                </h6>
                            </div>
                            <div className="border border-blue-500 my-2">
                                {"說明:"} - {ClassItem.Analyze}
                            </div>
                        </pre>
                    </div>
                );
            })}
        </div>
    );

    

}



export class ShowFieldBase {
    UI_Question_Major: boolean = true;
    UI_Question_Major_Audio: boolean = true;
    UI_Question_Image: boolean = true;
    UI_Question1: boolean = true;
    UI_Question2: boolean = true;
    UI_Quesetion_Audio: boolean = true;
    UI_Question_Major_Image: boolean = true;


    UI_Choose1: boolean = false;
    UI_Choose2: boolean = false;
    UI_Choose3: boolean = false;
    UI_Choose4: boolean = false;

    Category2: string = ""; // 題目類型
    Question: string = ""; // 題目
    Question_Major: string = ""; // 題目主題
    TestNo_Major: string = ""; // 題目主題編號
    Answer: string = ""; // 正解
    Analyze: string = ""; // 說明
    UserAnswer: string = ""; // 使用者答案
    Question_Image: string = ""; // 題目圖片
    TestTypeMain: string = ""; //
    TestTypeOrigin: string = "";
    TestType: string = "";
    UserChoose: string = ""; //ex: A,B,C,D
    Choose1: string = "";
    Choose2: string = "";
    Choose3: string = "";
    Choose4: string = "";
    Question_Audio: string = "";
    Question_Major_Audio: string = "";

    TestDetailID: number = 0;
    TestNo: number = 0;

    constructor(item: any) {
        this.Category2 = item.Category2;
        this.TestNo_Major = item.TestNo_Major;
        this.TestNo = item.TestNo;
        this.Question_Major = item.Question_Major;
        this.Question = item.Question;
        this.Answer = item.Answer;
        this.Analyze = item.Analyze;
        this.UserAnswer = item.UserAnswer;
        this.Question_Image = item.Question_Image;
        this.TestTypeMain = item.TestTypeMain;
        this.TestTypeOrigin = item.TestTypeOrigin;
        this.TestDetailID = item.TestDetailID;
        this.TestType = item.TestType;
        this.UserChoose = item.UserChoose;
        this.Choose1 = item.Choose1;
        this.Choose2 = item.Choose2;
        this.Choose3 = item.Choose3;
        this.Choose4 = item.Choose4;
        this.Question_Audio = item.Question_Audio;
        this.Question_Major_Audio = item.Question_Major_Audio;
    }
}
 
//考題模組優化計劃,目前ShowFieldBase 基底模組完成,如時間間,再照原專案,可如何依不同題型去各別呼叫===
//按下下一題呼叫 ShowTest 例如妙妙呼叫ShowTest_MiaoMiao ,細部的判斷
class ShowField_GEPT  extends ShowFieldBase  {
    item: any;
    
    constructor(item: any) {
        super(item);
        this.item = item;
        this.Category2 = item.Category2;
        this.TestNo_Major = item.TestNo_Major;
        this.TestNo = item.TestNo;
        this.Question_Major = item.Question_Major;
        this.Question = item.Question;
        this.Answer = item.Answer;
        this.Analyze = item.Analyze;
        this.UserAnswer = item.UserAnswer;
        this.Question_Image = item.Question_Image;
        this.TestTypeMain = item.TestTypeMain;
        this.TestTypeOrigin = item.TestTypeOrigin;
        this.TestDetailID = item.TestDetailID;
        this.TestType = item.TestType;
        this.UserChoose = item.UserChoose;
        this.Choose1 = item.Choose1;
        this.Choose2 = item.Choose2;
        this.Choose3 = item.Choose3;
        this.Choose4 = item.Choose4;
        this.Question_Audio = item.Question_Audio;
        this.Question_Major_Audio = item.Question_Major_Audio;
        // select case Category2
        // --  看圖辨義 問答 簡短對話
        switch (this.Category2) {
            case "看圖辨義":
                this.UI_Question_Major = false;
                this.UI_Question_Major_Audio = false;
                this.UI_Question1 = false;
                this.UI_Question_Major_Image = false;
                break;
            case "問答":

                this.UI_Question_Major_Audio = false;
                this.UI_Question1 = false;
                this.UI_Question_Major_Image = false;
                this.UI_Question_Image = false;

                this.UI_Question_Major_Image = false;
                break;
            case "簡短對話":
            case "對話":

                if (this.item.Question_Audio !== "") {
                    this.UI_Quesetion_Audio = true;
                }
                else {
                    this.UI_Quesetion_Audio = false;
                }


                if (this.item.Question_Major_Audio !== "") {
                    this.UI_Question_Major_Audio = true;
                }
                else {
                    this.UI_Question_Major_Audio = false;
                }


                if (this.item.Question_Image !== "") {
                    this.UI_Question_Image = true;
                }
                else {
                    this.UI_Question_Image = false;
                }


                if (this.item.Question_Major !== "") {
                    this.UI_Question1 = true;
                    // Question1.Text = ProcessParagraph(dr("Question_Major"), False)
                } else {
                    this.UI_Question1 = false;
                }


                this.UI_Question2 = true;
                //  Question2.Text = ProcessParagraph(dr("Question"), False)


                this.UI_Question_Image = false;


                if (this.item.Question === "無" || this.item.Question === "") {
                    this.UI_Question2 = false;
                }


                this.Question_Major = this.Question_Major.replace("M:", "<br>M:");
                this.Question_Major = this.Question_Major.replace("W:", "<br>W:");
                this.Question_Major = this.Question_Major.replace("Q:", "<br>Q:");
                this.Question_Major = this.Question_Major.replace("Q:", "<br>Q:");
                this.Question_Major = this.Question_Major.replace("Q：", "<br>Q:");
                this.UI_Question_Major = false;

                break;
            default:
                // 預設情況
                //  this.UI_Question_Major_Image = true;
                break;
        }

        //===判斷如有A,B,C,D 問題選項顯示出來
        // Dim arrChoose() As String = Trim(dr("UserChoose")).Split(",")
        if (this.UserChoose) {
            const choices = this.UserChoose.split(',').map(choice => choice.trim());
            choices.forEach(choice => {
                switch (choice) {
                    case 'A':
                        this.UI_Choose1 = true;
                        break;
                    case 'B':
                        this.UI_Choose2 = true;
                        break;
                    case 'C':
                        this.UI_Choose3 = true;
                        break;
                    case 'D':
                        this.UI_Choose4 = true;
                        break;
                    default:
                    //console.warn(`Unknown choice: ${choice}`);
                }
            });
        }



    }
}



export default App;
