import {  useState } from 'react'
import { ethers } from 'ethers'

const Dashboard = ({ domain, ioDomains, provider, id }) => {
    const [owner, setOwner] = useState(null)
    const [balance, setBalance] = useState(0);
    const [maxSupply, setMaxSupply] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);

    const infoHandler = async () => {
        const signer = await provider.getSigner()
        let transaction = await ioDomains.connect(signer).owner()
        setOwner(transaction)
        transaction = await ioDomains.connect(signer).getBalance()
        setBalance(ethers.utils.formatEther(transaction.toString()))
        transaction = await ioDomains.connect(signer).maxSupply()
        setMaxSupply(Number(transaction))
        transaction = await ioDomains.connect(signer).totalSupply()
        setTotalSupply(Number(transaction))
    }

    return (
        <div className='card'>
            <div className='card__info'>
                {owner ?
                    (<>
                        <p><small>
                            The Owner is: <br />
                            <span>
                                {owner.slice(0, 6) + '...' + owner.slice(38, 42)}
                            </span>
                        </small></p>
                        <p><small>
                            Contract balance: <br />
                            <span>
                                {balance}
                            </span>
                        </small></p>

                        <p><small>
                            Domains minted: <br />
                            <span>
                                {maxSupply}
                            </span>
                        </small></p>
                        <p><small>
                            Domains saled: <br />
                            <span>
                                {totalSupply}
                            </span>
                        </small></p>
                    </>
                    ) : ''}
            </div>
            <button
                type='button'
                className='card__button'
                onClick={infoHandler}
            >
                Summery
            </button>
        </div>
    );
}

export default Dashboard;