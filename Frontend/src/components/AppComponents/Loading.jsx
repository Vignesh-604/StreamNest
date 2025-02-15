import ReactLoading from 'react-loading';

export default function Loading() {
    return (
        <div className="flex flex-col items-center mt-30 text-2xl">
            <ReactLoading type={'spin'} width={100} className='mb-10'/>
            <h1>Loading data...</h1>
        </div>
    )
}