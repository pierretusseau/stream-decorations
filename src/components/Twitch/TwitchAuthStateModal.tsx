import React from 'react'
import { Box, Modal, TextField } from '@mui/material'
import useTwitchStore, { setTwitchAuthState } from '@/store/useTwitchStore';
import useSettingsStore, {
  editSupabaseDecorationsServiceKey,
  editSupabaseServiceKey,
  editUserAccessToken
} from '@/store/useSettingsStore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  // bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function TwitchAuthStateModal({
  open,
  setOpenModal,
}: {
  open: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const handleClose = () => setOpenModal(false);
  const twitchAuthState = useTwitchStore((state) => state.twitch_auth_state)
  const serviceKeyDeco = useSettingsStore((state) => state.supabase_decorations_service_key)
  const serviceKey = useSettingsStore((state) => state.supabase_service_key)
  const userToken = useSettingsStore((state) => state.user_access_token)

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="bg-neutral-900 flex flex-col gap-4">
        <p>If you&apos;re reading this and you don&apos;t know what it is, you shouldn&apos;t be here 😂</p>
        <TextField
          id="outlined-basic"
          label="Twitch Auth State"
          variant="outlined"
          type="password"
          value={twitchAuthState}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTwitchAuthState(e.target.value)}
          fullWidth
        />
        <TextField
          id="outlined-basic"
          label="SupaSupaDecorations"
          variant="outlined"
          type="password"
          value={serviceKeyDeco}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => editSupabaseDecorationsServiceKey(e.target.value)}
          fullWidth
        />
        <TextField
          id="outlined-basic"
          label="SupaSupaAmaw"
          variant="outlined"
          type="password"
          value={serviceKey}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => editSupabaseServiceKey(e.target.value)}
          fullWidth
        />
        <TextField
          id="outlined-basic"
          label="User Access Token"
          variant="outlined"
          type="password"
          value={userToken}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => editUserAccessToken(e.target.value)}
          fullWidth
        />
      </Box>
    </Modal>
  )
}

export default TwitchAuthStateModal