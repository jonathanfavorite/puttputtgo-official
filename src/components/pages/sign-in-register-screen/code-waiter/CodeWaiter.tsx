import React, { useEffect } from 'react'


enum CodeWaiterStates {
    Ready,
    Loading
}

function CodeWaiter() {

    const [code, setCode] = React.useState<string>('');
    const [codeArr, setCodeArr] = React.useState<string[]>([]); // ['1', '2', '3', '4'
    const hiddenTelRef = React.useRef<HTMLInputElement>(null);
    const [codeComplete, setCodeComplete] = React.useState<boolean>(false);
    const [codeWaiterState, setCodeWaiterState] = React.useState<CodeWaiterStates>(CodeWaiterStates.Ready);
    useEffect(() => {
      
        
        if(hiddenTelRef.current)
        {
            hiddenTelRef.current.blur();
            setTimeout(() => {
                if(hiddenTelRef.current)
                {
                    hiddenTelRef.current.focus();
                } 
            }, 1000);
            
           
        }

        
    }, []);

    useEffect(() => {
        let len = code.length;
        let arr = [];
        for(let i = 0; i < 4; i++)
        {
            if(i < len)
            {
                arr.push(code[i]);
            }
        }
        setCodeArr(arr);
    }, [code]);

    function tryGetCode(num: number) {
        if(code[num])
        {
            return code[num];
        }
        return '';
    }
    function tryGetCodeClass(num: number) {
        if(code[num])
        {
            return 'code-waiter-button-filled';
        }
        return '';
    }

    const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.value.length <= 4) {
            setCode(e.target.value);
        }
        else {
            e.target.value = e.target.value.substring(0, 4);
        }
        
    }

  return (
    <div className='code-waiter-wrap'>
        
         <div className='code-waiter-buttons-wrap'>
            
                <div className='code-waiter-buttons'>
                    {Array.from(Array(4).keys()).map((i, index) => {

                        return (
                            <div key={index} onClick={() => hiddenTelRef.current?.focus()} className={`code-waiter-button ${tryGetCodeClass(i)}`}>{tryGetCode(i)}</div>
                        )
                    })}

                </div>
                
            </div>
            
          <div className='code-waiter-description'>
          <div className='hidden-tel'><input type='tel' ref={hiddenTelRef} value={code} onChange={handleTelChange} /></div>
                <h1 className='heading'>We texted you</h1>
                <div className='desc'>check your messages, and enter the four digit code we sent you to login.</div>
          </div>

    </div>
  )
}

export default CodeWaiter