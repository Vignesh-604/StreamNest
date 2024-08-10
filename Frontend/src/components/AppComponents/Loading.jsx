import ReactLoading from 'react-loading';

export default function Loading() {
    return (
        <div className="flex flex-col items-center mt-5">
            <ReactLoading type={'spin'} />
            <h1>Loading data...</h1>
        </div>
    )
}