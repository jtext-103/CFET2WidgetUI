
class WebSocketEvent {
  constructor () {
    this.ws = new WebSocket('ws://192.168.0.195:8088')
    console.log(this.ws)
  }

  sentMessage (message) {
    message = message.toString()
    console.log(message)
    // this.ws = new WebSocket("ws://192.168.0.195:8088");
    // console.log(this.ws);
    console.log(this.ws)
    this.ws.onopen = function (event) {
      console.log('web socket connect success～')
      this.ws.send("{'SourcesAndTypes':[{'Source':'.*','EventType':'Changed'}],'action':0}")
    }
  }

  getMessage () {
    this.ws.onmessage = function (event) {
      console.log('receive respond message')
      console.log('event.data', event.data)
      return event.data
    }
  }

  close () {
    this.ws.onclose = function (event) {
      console.log('web socket close～')
    }
  }
}

export default new WebSocketEvent()
