
import React from 'react'
import { SketchPicker } from 'react-color'

export default class ColorPicker extends React.Component {
  state = {
    displayColorPicker: false,
    color: {
      r: '0',
      g: '0',
      b: '0',
      a: '1',
    },
  };

  componentWillMount() {
    this.updateDisplayedColor(this.props.color);
  }

  componentWillReceiveProps({ color }){
    this.updateDisplayedColor(color);
  }

  updateDisplayedColor(color){
    if (color) {
      const reg =  /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/;
      const split = color.match(reg);
      if (!split) {
        return;
      }

      const r = split[1];
      const g = split[2];
      const b = split[3];
      const a = split[4];

      this.setState({
        color: { r, g, b, a }
      })
    }
  }

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb })

    this.props.onChange(`rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`);
  };

  render() {
    const colorBg = `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`;
    return (
      <span className="color-picker">
        <div className="swatch" onClick={ this.handleClick }>
          <div className="color" style={{ backgroundColor: colorBg }} />
        </div>
        <label>{ this.props.label }</label>
        { this.state.displayColorPicker &&
          <div className="popover">
            <div className="cover" onClick={ this.handleClose }/>
            <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
          </div>
        }
      </span>
    )
  }
}
