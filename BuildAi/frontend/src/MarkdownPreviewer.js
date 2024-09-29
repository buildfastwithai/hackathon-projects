// import React, { useState } from "react";
// import { marked } from "marked";
// import DOMPurify from "dompurify";
// import { FiCopy,FiCheckCircle } from "react-icons/fi"; 

// const MarkdownPreviewer = ({ markdown }) => {
//   // State to manage copy status
//   const [copyStatus, setCopyStatus] = useState({ code: "", copied: false });

//   // Get sanitized HTML from markdown
//   const getMarkdownText = () => {
//     const rawMarkup = marked(markdown, { breaks: true, gfm: true });
//     return DOMPurify.sanitize(rawMarkup);
//   };

//   // Copy Code Handler
//   const copyToClipboard = (code) => {
//     navigator.clipboard.writeText(code);
//     setCopyStatus({ code, copied: true });

//     // Reset copy status after 2 seconds
//     setTimeout(() => {
//       setCopyStatus({ code: "", copied: false });
//     }, 2000);
//   };

//   // Function to render the markdown with code blocks handled separately
//   const renderMarkdownWithCodeBlocks = () => {
//     const blocks = markdown.split(/(```\w*\n[\s\S]*?```)/g); // Split by code blocks
//     return blocks.map((block, index) => {
//       // Check if the block is a code block
//       const isCodeBlock = block.startsWith("```");

//       if (isCodeBlock) {
//         const codeContent = block
//           .replace(/```.*\n/, "") // Remove the language specifier
//           .replace(/```$/, ""); // Remove the closing ```

//         // Extract the file type from the language specifier (if available)
//         const language = block.match(/```(\w+)/);
//         const fileType = language ? language[1] : "text"; // Default to 'text' if no match

//         return (
//           <div
//             key={index}
//             className="bg-blue-200   text-white rounded-lg mb-4 overflow-hidden my-6"
//           >
//             <button
//               onClick={() => copyToClipboard(codeContent.trim())}
//               className="flex w-full justify-between px-3 bg-gray-700 hover:bg-gray-600 text-white rounded p-2"
//             >
//               <div className="text-sm  text-gray-400">{`${fileType}`}</div>{" "}
//               {/* Display the file type */}
//               {copyStatus.copied && copyStatus.code === codeContent.trim() ? (
//                 <FiCheckCircle size={20} className="text-green-400" />
//               ) : (
//                 <FiCopy size={20} />
//               )}
//             </button>
//             <pre className="px-6 py-6 overflow-x-auto">
//               <code className="">{codeContent.trim()}</code>
//             </pre>
//           </div>
//         );
//       }

//       return (
//         <div
//           key={index}
//           dangerouslySetInnerHTML={{
//             __html: DOMPurify.sanitize(marked(block)),
//           }}
//         />
//       );
//     });
//   };

//   return (
//     <div className="bg-red-900  w-full flex justify-center items-center">
//       <div className="w-[64%] text-gray-400 p-8 bg-slate-800 border border-gray-300 rounded-lg overflow-auto markdown-preview">
//         {renderMarkdownWithCodeBlocks()}
//       </div>
//       <style jsx>{`
//         h2 {
//           font-size: 2rem; /* Increase font size for ## headings */
//           font-weight: bold;
//           margin-bottom: 16px;
//         }
//         h3 {
//           font-size: 1.2rem; /* Increase font size for ### headings */
//           font-weight: bold;
//           // margin-bottom: 12px;
//         }
//         .markdown-preview strong {
//           font-size: 1.15rem; /* Increase font size for bold text (like Breakdown:) */
//           font-weight: 700;
//           margin-bottom: 16px;
//         }

//         pre {
//           margin: 20px 0; /* Add space above and below code blocks */
//           line-height: 1.6; /* Increase line spacing for better readability */
//         }

//         /* Add horizontal scroll for code blocks */
//         .overflow-x-auto {
//           max-width: 100%; /* Ensure it does not exceed container width */
//           overflow-x: auto; /* Enable horizontal scrolling */
//         }

//         /* Custom styles for lists */
//         .markdown-preview ul {
//           list-style-type: disc; /* Circular bullet points for unordered lists */
//           padding-left: 20px; /* Add left padding */
//         }

//         .markdown-preview ol {
//           list-style-type: decimal; /* Decimal points for ordered lists */
//           padding-left: 20px; /* Add left padding */
//         }

//         .markdown-preview li {
//           margin-bottom: 10px; /* Add spacing between list items */
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MarkdownPreviewer;





import React, { useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { FiCopy, FiCheckCircle } from "react-icons/fi";

const MarkdownPreviewer = ({ markdown }) => {
  // State to manage copy status
  const [copyStatus, setCopyStatus] = useState({ code: "", copied: false });

  // Get sanitized HTML from markdown
  const getMarkdownText = () => {
    const rawMarkup = marked(markdown, { breaks: true, gfm: true });
    return DOMPurify.sanitize(rawMarkup);
  };

  // Copy Code Handler
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopyStatus({ code, copied: true });

    // Reset copy status after 2 seconds
    setTimeout(() => {
      setCopyStatus({ code: "", copied: false });
    }, 2000);
  };

  // Function to render the markdown with code blocks handled separately
  const renderMarkdownWithCodeBlocks = () => {
    const blocks = markdown.split(/(```\w*\n[\s\S]*?```)/g); // Split by code blocks
    return blocks.map((block, index) => {
      // Check if the block is a code block
      const isCodeBlock = block.startsWith("```");

      if (isCodeBlock) {
        const codeContent = block
          .replace(/```.*\n/, "") // Remove the language specifier
          .replace(/```$/, ""); // Remove the closing ```

        // Extract the file type from the language specifier (if available)
        const language = block.match(/```(\w+)/);
        const fileType = language ? language[1] : "text"; // Default to 'text' if no match

        return (
          <div
            key={index}
            className="bg-black text-white rounded-lg mb-4 overflow-hidden my-6"
          >
            <button
              onClick={() => copyToClipboard(codeContent.trim())}
              className="flex w-full justify-between px-3 bg-gray-700 hover:bg-gray-600 text-white rounded p-2"
            >
              <div className="text-sm text-gray-400">{`${fileType}`}</div>{" "}
              {/* Display the file type */}
              {copyStatus.copied && copyStatus.code === codeContent.trim() ? (
                <FiCheckCircle size={20} className="text-green-400" />
              ) : (
                <FiCopy size={20} />
              )}
            </button>
            <pre className="px-6 py-6 overflow-x-auto">
              <code className="">{codeContent.trim()}</code>
            </pre>
          </div>
        );
      }

      return (
        <div
          key={index}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(marked(block)),
          }}
        />
      );
    });
  };

  return (
    <div className="bg-gray-900 w-full flex justify-center items-center ">
      <div className="w-[64%] text-gray-400 p-8 bg-slate-800 border border-gray-300 rounded-lg overflow-auto markdown-preview h-screen
       overflow-y-scroll">
        {renderMarkdownWithCodeBlocks()}
      </div>
      <style jsx>{`
        h2 {
          font-size: 2rem; /* Increase font size for ## headings */
          font-weight: bold;
          margin-bottom: 16px;
        }
        h3 {
          font-size: 1.2rem; /* Increase font size for ### headings */
          font-weight: bold;
          // margin-bottom: 12px;
        }
        .markdown-preview strong {
          font-size: 1.15rem; /* Increase font size for bold text (like Breakdown:) */
          font-weight: 700;
          margin-bottom: 16px;
        }

        pre {
          margin: 20px 0; /* Add space above and below code blocks */
          line-height: 1.6; /* Increase line spacing for better readability */
        }

        /* Add horizontal scroll for code blocks */
        .overflow-x-auto {
          max-width: 100%; /* Ensure it does not exceed container width */
          overflow-x: auto; /* Enable horizontal scrolling */
        }

        /* Custom styles for lists */
        .markdown-preview ul {
          list-style-type: disc; /* Circular bullet points for unordered lists */
          padding-left: 20px; /* Add left padding */
        }

        .markdown-preview ol {
          list-style-type: decimal; /* Decimal points for ordered lists */
          padding-left: 20px; /* Add left padding */
        }

        .markdown-preview li {
          margin-bottom: 10px; /* Add spacing between list items */
        }
      `}</style>
    </div>
  );
};

export default MarkdownPreviewer;