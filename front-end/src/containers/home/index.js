import React, { Component } from 'react'
import {
  Button,
  Row,
  Col
} from 'react-bootstrap'
import {
  DataTable
} from '../../components'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)


class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isRecording: false,
      audioUrl: null,
      data: []
    }
    this.recordAudio = this.recordAudio.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.saveRecord = this.saveRecord.bind(this)
    this.getAudioRecords = this.getAudioRecords.bind(this)
    this.onDelete = this.onDelete.bind(this)
    this.onEdit = this.onEdit.bind(this)
  }
  render () {
    const {
      isRecording,
      audioUrl,
      data
    } = this.state
    return (
      <div>
        <Row>
          <Col>
            <h1 style={{textAlign: 'center'}}>Audio Recorder</h1>
          </Col>
        </Row>
        <Row>
          <Col style={{display: 'flex', alignItems: 'center'}}>
            {
              audioUrl ? 
                <audio src={audioUrl} controls></audio>
                :
                <audio src='' controls></audio>
            }
            &nbsp;&nbsp;&nbsp;
            {
              !isRecording ? 
                <Button variant='primary' onClick={this.recordAudio}>Grabar</Button>
                :
                <Button variant='danger' onClick={this.stopRecording}>Detener</Button>
            }
          </Col>
        </Row>
        <Row>
          <Col>
          </Col>
        </Row>
        <Row style={{marginTop: 40}}>
          <DataTable 
            data={data}
            onDelete={this.onDelete}
            onEdit={this.onEdit}
          />
        </Row>
      </div>
    )
  }
  componentDidMount() {
    this.getAudioRecords()
  }
  recordAudio () {
    navigator.mediaDevices.getUserMedia({audio: true})
    .then( stream => {
      const audioChunks =  []
      this.mediaRecorder = new MediaRecorder(stream)
      this.mediaRecorder.start()
      this.setState({isRecording: true})
      this.mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data)
      })
      this.mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { 'type' : 'audio/ogg; codecs=opus' })
        const audioUrl = URL.createObjectURL(audioBlob);
        this.setState({audioUrl: audioUrl})
        MySwal.fire({
          title: '¿Quiere guardar la grabación?',
          html: `<audio src="${audioUrl}" controls></audio>`,
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.saveRecord(audioBlob)
          }
        })
      })
    })
    .catch(err => window.alert(err))
  }
  stopRecording () {
    this.setState({isRecording: false})
    this.mediaRecorder.stop()
  }
  saveRecord (audioBlob) {
    const body = {
      name: `audio-${Date.now()}`,
      data: btoa(audioBlob)
    }
    fetch('http://localhost:8000/audio/add', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    })
    .then(res => res.json())
    .then(response => {
      console.log('response', response)
      MySwal.fire(
        'Audio Guardado',
        response,
        'success'
      )
      this.getAudioRecords()
    })
    .catch(err => console.log(err))
  }
  getAudioRecords () {
    fetch('http://localhost:8000/audio')
      .then(res => res.json())
      .then(json => {
        this.setState({data: json})
      })
  }
  onDelete (id) {
    const body = {
      id: id
    }
    MySwal.fire({
      title: '¿Quiere borrar la grabación?',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        fetch('http://localhost:8000/audio/delete', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          }
        })
        .then(res => {
          console.log(res)
          MySwal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          this.getAudioRecords()
        })
        .catch(err => console.log(err))
      }
    })

  }
  onEdit (id) {
    const body = {
      id: id
    }
    MySwal.fire({
      title: 'New Name',
      input: 'text',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      }
    }).then(({value}) => {
      if (value) {
        body['name'] = value
        fetch('http://localhost:8000/audio/edit', {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          }
        })
        .then(res => {
          console.log(res)
          MySwal.fire(
            'Updated!',
            'Your file has been Updated.',
            'success'
          )
          this.getAudioRecords()
        })
        .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
  }
}

export default Home