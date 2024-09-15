import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { formatTimestamp } from '@/lib/utils';
import { useMutation } from 'convex/react';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function RecordingDesktop({
  note,
  actionItems,
}: {
  note: Doc<'notes'>;
  actionItems: Doc<'actionItems'>[];
}) {
  const {
    generatingActionItems,
    generatingTitle,
    summary,
    transcription,
    title,
    _creationTime,
  } = note;

  // State to manage active tab, default to 'Transcription'
  const [activeTab, setActiveTab] = useState<string>('transcription');

  // States to manage the search and display of the word and description
  const [searchInput, setSearchInput] = useState<string>('');
  const [searchedWord, setSearchedWord] = useState<string>('');
  const [translatedWord, setTranslatedWord] = useState<string>(''); // Holds the translated word
  const [wordDescription, setWordDescription] = useState<string>(''); // Holds the word's description

  // Handle search button click
  const handleSearch = () => {
    setSearchedWord(searchInput);
  };

  // Mutation to remove an action item
  const mutateActionItems = useMutation(api.notes.removeActionItem);

  function removeActionItem(actionId: any) {
    mutateActionItems({ id: actionId });
  }

  return (
    <div className="hidden md:block">
      <div className="max-width mt-5 flex items-center justify-between">
        <div />
        <h1
          className={`leading text-center text-xl font-medium leading-[114.3%] tracking-[-0.75px] text-dark md:text-[35px] lg:text-[43px] ${
            generatingTitle && 'animate-pulse'
          }`}
        >
          {generatingTitle ? 'Generating Title...' : title ?? 'Untitled Note'}
        </h1>
        <div className="flex items-center justify-center">
          <p className="text-lg opacity-80">
            {formatTimestamp(Number(_creationTime))}
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mt-[18px] flex justify-start space-x-10 ml-[180px]">
        <button
          className={`text-2xl font-medium tracking-[-0.75px] ${
            activeTab === 'transcription' ? 'text-dark font-bold' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('transcription')}
        >
          Transcription
        </button>
        <button
          className={`text-2xl font-medium tracking-[-0.75px] ${
            activeTab === 'grammarFeedback' ? 'text-dark font-bold' : 'text-gray-400'
          }`}
          onClick={() => setActiveTab('grammarFeedback')}
        >
          Grammar Feedback
        </button>
      </div>

      {/* Content based on active tab */}
      <div className="mt-5 grid h-full w-full grid-cols-2 px-[30px] lg:px-[45px]">
        <div className="relative min-h-[70vh] w-full border-r px-5 py-3 text-justify text-xl font-[300] leading-[114.3%] tracking-[-0.6px] lg:text-xl">
          {/* Transcription tab content */}
          {activeTab === 'transcription' && (
            <div>
              {transcription ? (
                <p>{transcription}</p>
              ) : (
                <ul className="animate-pulse space-y-3">
                  <li className="h-6 w-full rounded-full bg-gray-200 dark:bg-gray-700"></li>
                  <li className="h-6 w-full rounded-full bg-gray-200 dark:bg-gray-700"></li>
                  <li className="h-6 w-full rounded-full bg-gray-200 dark:bg-gray-700"></li>
                  <li className="h-6 w-full rounded-full bg-gray-200 dark:bg-gray-700"></li>
                  <li className="h-6 w-full rounded-full bg-gray-200 dark:bg-gray-700"></li>
                </ul>
              )}
            </div>
          )}

          {/* Grammar Feedback tab content */}
          {activeTab === 'grammarFeedback' && (
            <div>
              {generatingActionItems ? (
                // Show placeholders when generating action items
                [0, 1, 3].map((item: any, idx: number) => (
                  <div
                    className="animate-pulse border-[#00000033] py-1 md:border-t-[1px] md:py-2"
                    key={idx}
                  >
                    <div className="flex w-full justify-center">
                      <div className="group w-full items-center rounded p-2 text-lg font-[300] text-dark transition-colors duration-300 checked:text-gray-300 hover:bg-gray-100 md:text-2xl">
                        <div className="flex items-center">
                          <input
                            disabled
                            type="checkbox"
                            checked={false}
                            className="mr-4 h-5 w-5 cursor-pointer rounded-sm border-2 border-gray-300"
                          />
                          <label className="h-5 w-full rounded-full bg-gray-200" />
                        </div>
                        <div className="flex justify-between md:mt-2">
                          <p className="ml-9 text-[15px] font-[300] leading-[249%] tracking-[-0.6px] text-dark opacity-60 md:inline-block md:text-xl lg:text-xl">
                            {new Date(Number(_creationTime)).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Display actual action items
                actionItems?.map((item: any, idx: number) => (
                  <div
                    className="border-[#00000033] py-1 md:border-t-[1px] md:py-2"
                    key={idx}
                  >
                    <div className="flex w-full justify-center">
                      <div className="group w-full items-center rounded p-2 text-lg font-[300] text-dark transition-colors duration-300 checked:text-gray-300 hover:bg-gray-100 md:text-2xl">
                        <div className="flex items-center">
                          <input
                            onChange={(e) => {
                              if (e.target.checked) {
                                removeActionItem(item._id);
                                toast.success('1 task completed.');
                              }
                            }}
                            type="checkbox"
                            checked={false}
                            className="mr-4 h-5 w-5 cursor-pointer rounded-sm border-2 border-gray-300"
                          />
                          <label className="">{item?.task}</label>
                        </div>
                        <div className="flex justify-between md:mt-2">
                          <p className="ml-9 text-[15px] font-[300] leading-[249%] tracking-[-0.6px] text-dark opacity-60 md:inline-block md:text-xl lg:text-xl">
                            {new Date(Number(_creationTime)).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right side - Word search and details */}
        <div className="relative mx-auto mt-[27px] w-full max-w-[900px] px-5 md:mt-[45px]">
          <h2 className="text-center text-2xl font-bold mb-6">Word Search and Details</h2>

          {/* Search box and button */}
          <div className="mb-6 flex items-center space-x-4">
            <input
              type="text"
              placeholder="Enter a word"
              className="w-full p-2 border border-gray-300 rounded"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="bg-dark text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </div>

          {/* Two text boxes side by side */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 border border-gray-300 rounded">
              <p>{searchedWord ? searchedWord : 'Input word will be shown here'}</p>
            </div>
            <div className="p-4 border border-gray-300 rounded">
              <p>Description of the word will appear here</p>
            </div>
          </div>

          {/* Image component */}
          <div className="text-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Word related image"
              className="mx-auto mb-4"
            />
            <p>Image description or context related to the searched word.</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center justify-center">
        <Link
          className="rounded-[7px] bg-dark px-5 py-[15px] text-[17px] leading-[79%] tracking-[-0.75px] text-light md:text-xl lg:px-[37px]"
          style={{ boxShadow: ' 0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}
          href="/dashboard/action-items"
        >
          View All Grammar Feedback
        </Link>
      </div>
    </div>
  );
}



// import { api } from '@/convex/_generated/api';
// import { Doc } from '@/convex/_generated/dataModel';
// import { formatTimestamp } from '@/lib/utils';
// import { useMutation } from 'convex/react';
// import Link from 'next/link';
// import { useState } from 'react';
// import toast from 'react-hot-toast';

// export default function RecordingDesktop({
//   note,
//   actionItems,
// }: {
//   note: Doc<'notes'>;
//   actionItems: Doc<'actionItems'>[];
// }) {
//   const {
//     generatingActionItems,
//     generatingTitle,
//     summary,
//     transcription,
//     title,
//     _creationTime,
//   } = note;
//   const [originalIsOpen, setOriginalIsOpen] = useState<boolean>(true);

//   const mutateActionItems = useMutation(api.notes.removeActionItem);

//   function removeActionItem(actionId: any) {
//     // Trigger a mutation to remove the item from the list
//     mutateActionItems({ id: actionId });
//   }

//   return (
//     <div className="hidden md:block">
//       <div className="max-width mt-5 flex items-center justify-between">
//         <div />
//         <h1
//           className={`leading text-center text-xl font-medium leading-[114.3%] tracking-[-0.75px] text-dark md:text-[35px] lg:text-[43px] ${
//             generatingTitle && 'animate-pulse'
//           }`}
//         >
//           {generatingTitle ? 'Generating Title...' : title ?? 'Untitled Note'}
//         </h1>
//         <div className="flex items-center justify-center">
//           <p className="text-lg opacity-80">
//             {formatTimestamp(Number(_creationTime))}
//           </p>
//         </div>
//       </div>

//       <div className="mt-[18px] grid h-fit w-full grid-cols-2 px-[30px] py-[19px] lg:px-[45px]">
//         <div className="flex w-full items-center justify-center gap-[50px] border-r  lg:gap-[70px]">
//           <div className="flex items-center gap-4">
//             <button
//               className={`text-xl leading-[114.3%] tracking-[-0.6px] text-dark lg:text-2xl ${
//                 originalIsOpen ? 'opacity-100' : 'opacity-40'
//               } transition-all duration-300`}
//             >
//               Transcript
//             </button>
//             <div
//               onClick={() => setOriginalIsOpen(!originalIsOpen)}
//               className="flex h-[20px] w-[36px] cursor-pointer items-center rounded-full bg-dark px-[1px]"
//             >
//               <div
//                 className={`h-[18px] w-4 rounded-[50%] bg-light ${
//                   originalIsOpen ? 'translate-x-0' : 'translate-x-[18px]'
//                 } transition-all duration-300`}
//               />
//             </div>
//             <button
//               className={`text-xl leading-[114.3%] tracking-[-0.6px] text-dark lg:text-2xl ${
//                 !originalIsOpen ? 'opacity-100' : 'opacity-40'
//               } transition-all duration-300`}
//             >
//               Grammar Feedback
//             </button>
//           </div>
//         </div>

//         <div className="text-center">
//           <h1 className="text-xl leading-[114.3%] tracking-[-0.75px] text-dark lg:text-2xl xl:text-[30px]">
//             All About a Word
//           </h1>
//         </div>
//       </div>

//       <div className="grid h-full w-full grid-cols-2 px-[30px] lg:px-[45px]">
//       <div className="relative min-h-[70vh] w-full border-r px-5 py-3 text-justify text-xl font-[300] leading-[114.3%] tracking-[-0.6px] lg:text-2xl">
//         {generatingActionItems
//             ? [0, 1, 3].map((item: any, idx: number) => (
//                 <div
//                   className="animate-pulse border-[#00000033] py-1 md:border-t-[1px] md:py-2"
//                   key={idx}
//                 >
//                   <div className="flex w-full justify-center">
//                     <div className="group w-full items-center rounded p-2 text-lg font-[300] text-dark transition-colors duration-300 checked:text-gray-300 hover:bg-gray-100 md:text-2xl">
//                       <div className="flex items-center">
//                         <input
//                           disabled
//                           type="checkbox"
//                           checked={false}
//                           className="mr-4 h-5 w-5 cursor-pointer rounded-sm border-2 border-gray-300"
//                         />
//                         <label className="h-5 w-full rounded-full bg-gray-200" />
//                       </div>
//                       <div className="flex justify-between md:mt-2">
//                         <p className="ml-9 text-[15px] font-[300] leading-[249%] tracking-[-0.6px] text-dark opacity-60 md:inline-block md:text-xl lg:text-xl">
//                           {new Date(Number(_creationTime)).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             : actionItems?.map((item: any, idx: number) => (
//                 <div
//                   className="border-[#00000033] py-1 md:border-t-[1px] md:py-2"
//                   key={idx}
//                 >
//                   <div className="flex w-full justify-center">
//                     <div className="group w-full items-center rounded p-2 text-lg font-[300] text-dark transition-colors duration-300 checked:text-gray-300 hover:bg-gray-100 md:text-2xl">
//                       <div className="flex items-center">
//                         <input
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               removeActionItem(item._id);
//                               toast.success('1 task completed.');
//                             }
//                           }}
//                           type="checkbox"
//                           checked={false}
//                           className="mr-4 h-5 w-5 cursor-pointer rounded-sm border-2 border-gray-300"
//                         />
//                         <label className="">{item?.task}</label>
//                       </div>
//                       <div className="flex justify-between md:mt-2">
//                         <p className="ml-9 text-[15px] font-[300] leading-[249%] tracking-[-0.6px] text-dark opacity-60 md:inline-block md:text-xl lg:text-xl">
//                           {new Date(Number(_creationTime)).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//         </div>

//         {/* Right side - All About a Word */}

//         <div className="relative mx-auto mt-[27px] w-full max-w-[900px] px-5 md:mt-[45px]">
//           {generatingActionItems
//             ? [0, 1, 3].map((item: any, idx: number) => (
//                 <div
//                   className="animate-pulse border-[#00000033] py-1 md:border-t-[1px] md:py-2"
//                   key={idx}
//                 >
//                   <div className="flex w-full justify-center">
//                     <div className="group w-full items-center rounded p-2 text-lg font-[300] text-dark transition-colors duration-300 checked:text-gray-300 hover:bg-gray-100 md:text-2xl">
//                       <div className="flex items-center">
//                         <input
//                           disabled
//                           type="checkbox"
//                           checked={false}
//                           className="mr-4 h-5 w-5 cursor-pointer rounded-sm border-2 border-gray-300"
//                         />
//                         <label className="h-5 w-full rounded-full bg-gray-200" />
//                       </div>
//                       <div className="flex justify-between md:mt-2">
//                         <p className="ml-9 text-[15px] font-[300] leading-[249%] tracking-[-0.6px] text-dark opacity-60 md:inline-block md:text-xl lg:text-xl">
//                           {new Date(Number(_creationTime)).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             : actionItems?.map((item: any, idx: number) => (
//                 <div
//                   className="border-[#00000033] py-1 md:border-t-[1px] md:py-2"
//                   key={idx}
//                 >
//                   <div className="flex w-full justify-center">
//                     <div className="group w-full items-center rounded p-2 text-lg font-[300] text-dark transition-colors duration-300 checked:text-gray-300 hover:bg-gray-100 md:text-2xl">
//                       <div className="flex items-center">
//                         <input
//                           onChange={(e) => {
//                             if (e.target.checked) {
//                               removeActionItem(item._id);
//                               toast.success('1 task completed.');
//                             }
//                           }}
//                           type="checkbox"
//                           checked={false}
//                           className="mr-4 h-5 w-5 cursor-pointer rounded-sm border-2 border-gray-300"
//                         />
//                         <label className="">{item?.task}</label>
//                       </div>
//                       <div className="flex justify-between md:mt-2">
//                         <p className="ml-9 text-[15px] font-[300] leading-[249%] tracking-[-0.6px] text-dark opacity-60 md:inline-block md:text-xl lg:text-xl">
//                           {new Date(Number(_creationTime)).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//           <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center justify-center">
//             <Link
//               className="rounded-[7px] bg-dark px-5 py-[15px] text-[17px] leading-[79%] tracking-[-0.75px] text-light md:text-xl lg:px-[37px]"
//               style={{ boxShadow: ' 0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}
//               href="/dashboard/action-items"
//             >
//               View All Action Items
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
