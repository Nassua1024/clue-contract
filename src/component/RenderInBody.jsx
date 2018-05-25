export default class Index extends React.Component {

    componentDidMount() {
        this.popup = document.createElement('div')
        document.body.appendChild(this.popup)
        this._renderLayer()
    }

    componentDidUpdate() {
        this._renderLayer()
    }

    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(this.popup)
        document.body.removeChild(this.popup)
    }

    _renderLayer() {
        ReactDOM.render(this.props.children, this.popup)
    }

    render() {
        return null
    }
}
