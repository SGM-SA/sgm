import { EtapeDetailAjustage, fetchApiEtapesPartialUpdate } from '@sgm/openapi'
import { Row } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import DefaultEditor from 'react-simple-wysiwyg'
import { toast } from 'react-toastify'

type EtapeDescriptionEditorProps = {
    row: Row<EtapeDetailAjustage>
}

export const EtapeDescriptionEditor: React.FC<EtapeDescriptionEditorProps> = ({ row }) => {

    const [description, setDescription] = useState<string | undefined>()
    const [lastUpdatedDescription, setLastUpdatedDescription] = useState<string | undefined>()

    useEffect(() => {
        const initialValue = row.original.description || ''
        setDescription(initialValue)
        setLastUpdatedDescription(initialValue)
    }, [row.original.description])

    const handleUpdate = () => {
        if (lastUpdatedDescription !== description) {
            fetchApiEtapesPartialUpdate({ pathParams: { id: row.original.id }, body: { description } })
                .then(() => {
                    toast.success('Description mise à jour')
                    setLastUpdatedDescription(description)
                })
                .catch(() => toast.error('Erreur lors de la mise à jour de la description'))
        }
    }

    return <DefaultEditor 
        value={description}
        onChange={(e) => {
            setDescription(e.target.value || undefined)
        }}
        onBlur={(e) => handleUpdate()}
    />
}
