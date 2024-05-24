import UploadFilesDialog from "@/components/dialogs/upload-files-dialog"
import CreateItemDialog from "@/components/dialogs/create-item";
import ImportHotToast from "@/components/import-toaster";
import CheckConnection from "@/components/check-connection";

export default function Dialogs() {
    return (
        <div>
            {/* Upload Files Modal */}
            <UploadFilesDialog />

            {/* Create item dialog */}
            <CreateItemDialog />

            {/* Import hot toast */}
            <ImportHotToast />

            {/* Internet connection Footer */}
            <CheckConnection />

        </div>
    )
}