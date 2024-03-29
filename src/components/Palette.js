import React, { Component } from 'react';
import ColorBox from './ColorBox';
import Navbar from './Navbar';
import Footer from './Footer';
import {
  Root,
  PaletteColors
} from '../styles/PaletteStyles';


class Palette extends Component {

  /** STATE
   * - Level is set to 500 by default. It controls the lightness/darkness of the colors
   * - The color format is initially set to hex {format: 'hex'} and is changed depending on what the user selects (i.e the color format) in the Navbar
   */

  state = {
    level: 500,
    format: 'hex',
    snackbarOpen: false,
    colorFormat: 'HEX - #AB7C90',
    copied: false
  }

  changeParentCopy = evt => {
    this.setState({ copied: true }, () => {
      setTimeout(() => this.setState({ copied: false }), 1500);
    });
  }

  changeLevel = (level) => {
    this.setState({ level });
  }

  colorFormatHandler = () => {
    if (this.state.format === 'hex') {
      return 'HEX - #AB7C90'
    } else if (this.state.format === 'rgb') {
      return 'RGB - rgb(237, 222, 140)'
    } else if (this.state.format === 'rgba') {
      return 'RGBA - rgba(237, 222, 140, 0.8)'
    }
  }

  // To be passed into Navbar and used in Select component in Navbar
  changeFormat = evt => {
    this.setState({ format: evt.target.value, snackbarOpen: true }, () => {
      this.setState({ colorFormat: this.colorFormatHandler() });
    });
    setTimeout(() => {
      this.setState({ snackbarOpen: false })
    }, 2000);
  }

  closeSnackbar = () => {
    this.setState({ snackbarOpen: false });
  }

  render() {
    const { colors, paletteName, emoji, id: paletteId } = this.props.palette;
    const { level, copied } = this.state;
    const ColorBoxes = colors[level].map(colorDetails => (
      <ColorBox
        background={colorDetails[this.state.format]}
        name={colorDetails.name}
        key={colorDetails.id}
        id={colorDetails.id}
        paletteId={paletteId}
        copied={copied}
        changeParentCopy={this.changeParentCopy}
        showLink
        canCopy
      />
    ));

    return (
      <Root copied={copied}>
        <Navbar
          level={level}
          changeLevel={this.changeLevel}
          handleChange={this.changeFormat}
          closeSnackbar={this.closeSnackbar}
          colorFormat={this.state.format}
          open={this.state.snackbarOpen}
          showSlider
        />
        <PaletteColors>
          {ColorBoxes}
        </PaletteColors>
        <Footer
          paletteName={paletteName}
          emoji={emoji}
        />
      </Root>
    )
  }
}

export default Palette;