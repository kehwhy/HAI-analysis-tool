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