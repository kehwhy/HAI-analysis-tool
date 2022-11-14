import React from "react";

export const Modal = ({isOpen}) => {
    return (
        <Modal
        open={isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <div>
                <h1>Upload your CSV file</h1>
                <form method="POST" action="" enctype="multipart/form-data">
                    <p><input type="file" name="file" /></p>
                    <p><input type="text" name="label" /></p>
                    <p><input type="submit" value="Submit" /></p>
                </form>
            </div>
        </Modal>

    )
}


// const onUploadFiles = (result, options) => {
//     const totalCount = options.files.length;
//     options.files.map((file, i) => {
//       const formData = new FormData();
      
      
//       // options.files.forEach(file => {
//       formData.append('file', file);
//       $.ajax({
//         url: UploadURL,
//         type: 'POST',
//         xhr() {
//           const myXhr = $.ajaxSettings.xhr();
//           if (myXhr.upload) {
//             myXhr.upload.addEventListener(
//               'progress',
//               event => {
//                 let percent = 0;
//                 const position = event.loaded || event.position;
//                 const total = event.total;
//                 percent = (position / total) * 100;
//                 console.log('percent', percent);
//                 console.log('count', `${i}of${totalCount}`);
//               },
//               false,
//             );
//           }
//           return myXhr;
//         },
//         success(data) {
//           options.callback(
//             'success',
//             // multiple file fix
//             [file].map(file => {
//               return {
//                 file,
//                 content: data.secure_url,
//               };
//             }),
//           );
//         },
//         error(error) {
//         },
//         async: true,
//         data: formData,
//         cache: false,
//         contentType: false,
//         processData: false,
//         timeout: 60000,
//       });
//     });
//   };