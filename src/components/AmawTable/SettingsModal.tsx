import React from 'react'
import useSettingsStore, { editSupabaseServiceKey } from '@/store/useSettingsStore'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'

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

function HuntCellModal({
  open,
  setOpenModal,
}: {
  open: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const service_key = useSettingsStore((state) => state.supabase_service_key)
  
  const handleServiceKeyChange = (value: string) => {
    editSupabaseServiceKey(value)
  }
  const handleClose = () => setOpenModal(false);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="bg-neutral-900">
        <div className="flex items-center gap-2 mt-2">
          <input
            className="bg-neutral-700 grow"
            type="text"
            value={service_key}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleServiceKeyChange(e.target.value)}
          />
        </div>
      </Box>
    </Modal>
  )
}

export default HuntCellModal