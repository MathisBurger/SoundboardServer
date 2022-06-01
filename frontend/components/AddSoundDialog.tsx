import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";
import React, {useState} from "react";
import {ORIGIN} from "../constants";
import useAccessToken from "../hooks/useAccessToken";

interface AddSoundDialogProps {
    open: boolean;
    onClose: () => void;
    refreshSoundList: () => void;
}

const AddSoundDialog: React.FC<AddSoundDialogProps> = ({open, onClose, refreshSoundList}) => {

    const [files, setFiles] = useState([]);
    const {accessToken} = useAccessToken();

    const addSound = async () => {
        if (files.length === 0) {
            return;
        }
      const formData = new FormData();
      formData.append('file', files[0]);
      await fetch(`${ORIGIN}/api/addSound`, {
          method: 'POST',
          body: formData,
          headers: {
              Authorization: `accessToken ${accessToken}`
          }
      });
      refreshSoundList();
      onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>Add new sound</DialogTitle>
            <DialogContent>
                <TextField
                    type="file"
                    //@ts-ignore
                    onChange={(e) => setFiles(e.target.files)}
                    label="Soundfile"
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="primary" onClick={onClose}>
                    close
                </Button>
                <Button variant="contained" color="primary" onClick={addSound}>
                    Add sound
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddSoundDialog;