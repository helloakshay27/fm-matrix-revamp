import { ArrowPathIcon } from '@heroicons/react/20/solid'

const Loader = ({message,error}) => {
  return (
    <>
    {!error && (
    <div className="p-4 flex justify-center items-center min-h-[200px]">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-500 mr-2" />{" "}
        {message}
      </div>
    )
    }
   { error  && (
      <div className="p-4 text-red-600 min-h-[100px]">
        <strong>Error fetching tasks:</strong>{" "}
        {typeof error === "object"
          ? JSON.stringify(error)
          : String(error)}
      </div>
    )
   }
   </>
  );
}

export default Loader