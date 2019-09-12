import React from 'react'
import {
  Table
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons'


const createTableRows = (data, onDelete, onEdit) => {
  return data.map(({data, name, _id}, i) => {
    var audioBlob = new Blob(data.data, { 'type' : 'audio/ogg; codecs=opus' })
    const audioUrl = URL.createObjectURL(audioBlob);
    console.log(audioUrl)
    return (
      <tr key={i}>
        <td>{name}</td>
        <td><audio src={audioUrl} controls></audio></td>
        <td>
          <FontAwesomeIcon icon={faEdit} onClick={() => onEdit(_id)} title='Edit' />
          &nbsp;&nbsp;
          <FontAwesomeIcon icon={faTimes} onClick={() => onDelete(_id)} title='Delete' />
        </td>
      </tr>
    )
  })
}

const DataTable = ({data, onDelete, onEdit}) => (
  <Table striped bordered hover variant="dark">
    <thead>
      <tr>
        <th>Name</th>
        <th>Audio</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {createTableRows(data, onDelete, onEdit)}
    </tbody>
  </Table>
)


export default DataTable