import React from 'react'

const Details = () => {

  return (
    <div className="flex flex-col gap-5 p-10">
        <div className="flex justify-between gap-10">
            <div className="flex justify-start gap-4 w-2/3">
                 <span className="rouneded-full bg-[#D5DBDB] w-[65px] h-[65px]">AT</span>
                 <div className='flex flex-col gap-5'>
                    <span>Abhindya A</span>
                    <div className="flex justify-between gap-10">
                        <span>Email Id :abhindya.t@lockated</span>
                        <span>Role : Designer</span>
                        <span>Reports To: kshitij R</span>
                        <span className='text-green-500'>Active</span>
                    </div>
                 </div>
            </div>
            <div>
                 <span>Back</span>
            </div>
        </div>
        <div>
            <div>
                <div className="flex justify-between gap-4">
                      <div>
                         <h1 className="block">Planned Hours</h1>
                         <span>00 : 00</span>
                      </div>
                      <vr />
                      <div>
                          <h1 className="block">Actual Hours</h1>
                         <span>00 : 00</span>
                      </div>
                </div>
                <div className="flex justify-between gap-4">
                      <div>
                         <h1 className="block">Milestones</h1>
                         <span>open: 00</span>
                         <span>closed: 00</span>
                      </div>
                      <vr />
                      <div>
                          <h1 className="block">Tasks</h1>
                           <span>open: 00</span>
                         <span>closed: 00</span>
                      </div>
                </div>
            </div>
            <div>

            </div>
        </div>
    </div>
  )
}

export default Details