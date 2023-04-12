import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import {providers,Contract} from "ethers";
import { useEffect,useState,useRef } from "react";

export default function Home(){
    const [walletConnected, setWalletConnected] = useState(false);
    const [joinedWhitelist, setJoinedWhitelist] = useState(false);
    const [loading,setLoading] = useState(false);
    const [numberOfWhitelisted,setNumberOfWhitelisted] = useState(0);
    const web3ModalRef = useRef();

    const abi = [
        {
            "inputs": [],
            "name": "addAddresstoWhiteList",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "maxWhitelistedAddress_",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "maxWhitelistedAddress",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "numWhitelistedAddress",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "whitelistedAddress",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
    async function getSignerOrProvider (needSigner = false) {
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);

        const {chainId} = await web3Provider.getNetwork();

        if(chainId!== 11155111){
            window.alert("Change the network to Sepolia");
            throw new error("Change the network to Sepolia");
        }

        if(needSigner){
            const signer = web3Provider.getSigner();
            return signer;
        }

        return web3Provider;
    };

    async function addAddressToWallet () {
        try {const signer = await getSignerOrProvider(true);
        const whitelistContract =  new Contract("0xD035C52f2F36776F28ca73a67d730c1089328730",abi,signer);
        const tx = await whitelistContract.addAddresstoWhiteList();
        setLoading(true);
        await tx.wait();
        setLoading(false);
        await getNumberOfWhitelisted();
        setJoinedWhitelist(true);
        }catch(err){
            console.error(err);
        }
    };

    async function getNumberOfWhitelisted(){
        try{
            const provider = await getSignerOrProvider();
            const whitelistContract =  new Contract("0xD035C52f2F36776F28ca73a67d730c1089328730",abi,provider);
            const _numberOfWhitelisted = await whitelistContract.numWhitelistedAddress();
            setNumberOfWhitelisted(_numberOfWhitelisted.toString());
        }catch(err){
            console.error(err);
        }
    };

    async function checkAddressInWhitelist (){
        try{
            const signer = await getSignerOrProvider(true);
            const whitelistContract =  new Contract("0xD035C52f2F36776F28ca73a67d730c1089328730",abi,signer);
            const address = await signer.getAddress();
            const _joinedAddress =await whitelistContract.whitelistedAddress(address);
            setJoinedWhitelist(_joinedAddress);
        }catch (err){
            console.error(err);
        }
    };

    async function connectWallet(){
        try{
            await getSignerOrProvider();
            setWalletConnected(true);
            checkAddressInWhitelist();
            getNumberOfWhitelisted();
        }catch(err){
            console.error(err);
        }
    };

    function renderButton() {
        if(walletConnected){
            if(joinedWhitelist){
                return (<div class ={styles.description}>Thanks for Joining the Whitelist</div>);
            }else if(loading){
                return <button class = {styles.button}>Loading...</button>;
            } else{
                return <button class = {styles.button} onClick={addAddressToWallet}>Join the Whitelist</button>;
            }
        }
        else {
            return <button class={styles.button} onClick={connectWallet}>Connect your Wallet</button>;
            }
    };

    useEffect(() => {
        if(!walletConnected){
            web3ModalRef.current = new Web3Modal({
                network:"goerli",
                providerOptions:{},
                disableInjectedProvider:false,
            });
            connectWallet();
        }
    },[walletConnected]);

    return(
        <div>
            <Head>
                <title>Whitelist Dapp</title>
                <link rel="icon" href="/favicon.ico"></link>
            </Head>

            <div className={styles.main}>
                <div>
                    <h1 className={styles.head}>Welcome to Krypto Koin</h1>
                    <div className={styles.description}>It&#39;s an NFT collection for developers in Crypto</div>
                    <div className={styles.description}> {numberOfWhitelisted} have already joined in Whitelist</div>
                    <div>{renderButton()}</div>
                </div>
                <div>
                    <img className={styles.image} src="./crypto-devs.svg"></img>
                </div>
            </div>

            <footer className={styles.footer}>
                Made with &#100084; by Krypto Koin
            </footer>
        </div>
    );
}