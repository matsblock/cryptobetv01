import { getSession, signOut } from 'next-auth/react';
import { useContractRead, usePrepareContractWrite, useContractWrite } from 'wagmi'
import { daiAbi, betContractAbi, sep03ContractAddress, requestId } from "../constants"
import { useEffect, useState } from 'react'
import { BigNumber, ethers } from "ethers"

// gets a prop from getServerSideProps
function User({ user }) {
    console.log("user component")

    //STATES
    const [amount, setAmount] = useState("");
    const [balanceOfThisToken, setBalanceOfThisToken] = useState("");


        //READ (Aveces muestra un valor viejo en el balance)
        const { data, isError, isLoading } = useContractRead({
            chain: 42,
            addressOrName: '0x29282139fD1A88ccAED6d3bb7f547192144C0f95',
            contractInterface: daiAbi,
            functionName: 'balanceOf',
            args: [user.address]
        })


    //utilizo useffect porque sino da un error de hidratacion https://nextjs.org/docs/messages/react-hydration-error
    useEffect(() => {
        if(data!=undefined){
            const _balanceOfThisToken = getFormattedNumbersInEther(data)
            setBalanceOfThisToken(_balanceOfThisToken)
        }
 
    //     console.log("data", data._hex)
    //     const hData=  data._hex;
    //     const jData = JSON.stringify(data)
    //     console.log("DATA json", jData)
    //     const fData = ethers.utils.formatEther(hData)
    //     console.log("DATA convert", fData)
    
    //     // const _balanceOf = ethers.utils.formatEther(String(data));
    //     const _balanceOf = fData
    //     setBalanceOf(_balanceOf)
    }, [amount])

    // WRITE
    const { config, error } = usePrepareContractWrite({
        chainId: 42,
        addressOrName: '0x29282139fD1A88ccAED6d3bb7f547192144C0f95',
        contractInterface: daiAbi,
        functionName: 'faucet',
        args: [amount],
    })
    const { write } = useContractWrite(config)

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log("amount:", amount)
        write()
      }

      function getFormattedNumbersInEther(data) {
        // console.log ("data is: ", data, " ", typeof(data))
        // console.log ("Is BigNumber: ",  ethers.BigNumber.isBigNumber(data))
        // console.log("To String: ",  data.toString())
        // console.log("formatted: ", ethers.utils.formatEther(data))
        return(ethers.utils.formatEther(data))
    }

    return (
        <div>
            <button onClick={() => signOut({ redirect: '/signin' })}>Sign out</button>
            <h4>User session:</h4>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <h5>Read function:</h5>
            <div>Balance:{balanceOfThisToken}</div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="faucet">Faucet:</label>
                <input type="text" 
                id="faucet" name="faucet" 
                onChange={(e) => setAmount(e.target.value)}
                />
                <input type="submit" />
            </form>
        </div>
    );
}

export async function getServerSideProps(context) {
    console.log("server side!")

    const session = await getSession(context);
        console.log("server side!")

    // redirect if not authenticated
    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        };
    }



    return {
        props: { user: session.user },
    };
    
 
}



export default User;