
import QueryFetcher from "./components/QueryFetcher";


function App() {
//   const API_KEY = process.env.REACT_APP_API_KEY;

//   const [query,setQuery]=useState("");
//   const [res,setRes]=useState("Response will display here");
//   async function generateAnswer(){
//     console.log(query)
//     console.log(API_KEY)
//     if(query!==""){
//       try{
//         console.log("calling API...")
//         const responce = await axios({
//           method: "post",
//           url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
//           data: {
//             "contents":[
//               {"parts":[{"text":query}]}
//             ]
//           }
//         })
  
//         console.log(responce);
//         setRes(responce.data.candidates[0].content.parts[0].text);
//         setQuery("");
//       }catch(err){
//         console.log(`Error in axios POST request:\n ${err}`)
//       }
//       console.log("finish...")
//     }
//  }

//  function onChangeHandler(event){
//   setQuery(event.target.value);
//  }
 
//  function onKeyEnterHandler(e){
//   console.log("Key Press DEtected")
//   if (e.key === 'Enter') {
//     generateAnswer();  // Call the function when Enter key is pressed
//   }
//  }


  return (
    <div className="relative w-full min-h-screen bg-black items-center justify-center overflow-x-hidden">
      <img src="/buildfast.png" width={150} className="fixed top-0 left-0 p-2" loading="lazy" alt="Buil Fast with AI logo"/>
      <QueryFetcher/>
    </div>
  )
}

export default App
