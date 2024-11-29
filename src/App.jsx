import { useState , useEffect } from 'react'
import './App.css'
import audio from './assets/mixkit-system-beep-buzzer-fail-2964.wav'

function App() {

  const [breakLength, setBreakLength] = useState(5);
  const [session, setSession] = useState(25);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(session * 60);
  const [breakTimeLeft, setbreakTimeLeft] = useState(breakLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);

  const beep = document.getElementById("beep");


  const startTimer = () => {
    if(isRunning == false){
      setIsRunning(true);
    }else{
      setIsRunning(false);
    }
  }

  useEffect(() => {

    setSessionTimeLeft(session * 60);
  },[session])

  useEffect(() =>{
    setbreakTimeLeft(breakLength * 60);
  },[breakLength])

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {

      if(isSession){
        setSessionTimeLeft((prev) =>  {
          if(prev > 0){
            return prev -1;
          }
          beep.play();
          setIsSession(false);
          return breakTimeLeft;
        });
      }else{
        setbreakTimeLeft((prev) => {
          if(prev > 0){
            return prev -1;
          }
          beep.play();
          setIsSession(true);
          return sessionTimeLeft;
        })
      }


    },1000)
  
    return () => clearInterval(timer);
  }, [isRunning, isSession ,sessionTimeLeft, breakTimeLeft]);

  const minute = () => {
    const time = isSession ? sessionTimeLeft : breakTimeLeft;
    const m = Math.floor(time/60);
    const s = time % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2,'0')}`;
  };


  const handleBreakLength = (value) => {
    if(value == "-" && breakLength > 1){
      setBreakLength(breakLength -1);
    }else if(value == "+" && breakLength < 60){
      setBreakLength(breakLength +1);
    }
  };
  const handelSessionLength = (value) => {
    if(!isRunning){
      if(value == "-" && session > 1){
        setSession(session -1);
      }else if(value == "+" && session < 60){
        setSession(session +1);
      }
    }
    
  };

  const handleReset = () => {
    setSession(25);
    setBreakLength(5);
    setIsRunning(false)
    setIsSession(true)

    const beep = document.getElementById("beep");
    beep.pause(); 
    beep.currentTime = 0; 
  }

  const timerlable = isSession ? "Session" : "Break";


  return (
    <div className='h-screen flex justify-center items-center text-white font-mono'>
      <div className='h-[300px] rounded-3xl shadow-2xl w-[500px] p-2 grid grid-rows-5 grid-cols-2 bg-purple-800'>
        <div className='flex flex-col justify-center items-center gap-2 row-span-2'>
          <span id='break-label'>Break Length</span>
          <div className='flex items-center gap-5'>
            <button id='break-decrement' className='w-12 h-12 bg-black rounded-full' onClick={() => handleBreakLength("-")}>-</button>
            <span id='break-length'>{breakLength}</span>
            <button id='break-increment' className='w-12 h-12 bg-black rounded-full' onClick={() => handleBreakLength("+")}>+</button>
          </div>
        </div>
        
        <div className='flex flex-col justify-center items-center gap-2 row-span-2'>
          <span id='session-label'>Session Length</span>
          <div className='flex items-center gap-5'>
            <button id='session-decrement' className='w-12 h-12 bg-black rounded-full' onClick={() => handelSessionLength("-")}>-</button>
            <span id='session-length'>{session}</span>
            <button id='session-increment' className='w-12 h-12 bg-black rounded-full' onClick={() => handelSessionLength("+")}>+</button>
          </div>
          
        </div>

        <div className='col-span-2 row-span-2 flex flex-col items-center justify-center'>
          <span id='timer-label'>{timerlable}</span>
          <div id='time-left' className='h-20 w-20 bg-black  flex justify-center items-center rounded-md'>{minute()}</div>
          <audio src={audio} id='beep' loop></audio>
        </div>
        
        <div className='flex justify-center gap-7 items-center col-span-2'>
          <button id='start_stop' onClick={startTimer}>[start/stop]</button>
          <button id='reset' onClick={handleReset}>[reset]</button>
        </div>


      </div>
    </div>
  )
}

export default App
