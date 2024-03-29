import React, { Component } from 'react';
import PaletteFormNav from './PaletteFormNav';
import ColorPickerForm from './ColorPickerForm';
import DraggableColorList from './DraggableColorList';
import seedColors from '../seedColors';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { createGlobalStyle } from 'styled-components';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
// TODO: REFACTOR THIS COMPONENT TO USE STYLED-COMPONENTS INSTEAD OF MATERIAL-UI's IN-HOUSE STYLING SOLUTION

const drawerWidth = 400;

// a global style to override the default properties inherited from body when on the /palette/new route
// yes, I know. I used !important as a last resort, didn't see any other way of fixing this annoying issue. If I had to guess it is probably the material ui stuff which overrides the default body values
const GlobalStyle = createGlobalStyle`
  body {
    letter-spacing: normal !important;
    line-height: normal !important;
    font-family: 'Lato', sans-serif !important;
    font-size: 100% !important;
  }
`;

const styles = (theme => ({
  root: {
    display: 'flex',
  },
  title: {
    textTransform: 'uppercase',
    fontSize: '1.6rem',
    fontWeight: 300,
    fontFamily: '"Montserrat", serif',
    marginRight: '.5em',
  },
  subButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  subButton: {
    color: '#202020',
    border: '1.5px solid #000',
    fontWeight: '700',
    margin: '0px 10px',
  },
  saveButton: {
    border: '1.5px solid #fff',
    color: '#fff'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  drawerContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    width: '90%',
    alignSelf: 'center'
  },
  content: {
    flex: 1,
    height: 'calc(100vh - 64px)',
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    padding: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0
  }
  
}));

class NewPaletteForm extends Component {
  state = {
    open: false,
    colors: this.props.palettes[0] ? this.props.palettes[0].colors : seedColors[0].colors,
  }

  /**
   * @param oldIndex Extracted from the default args given to us. gives the old index position of the element
   * @param newIndex Same as OldIndex. gives the new index position of the element
   * 
   * - Constructs a newly ordered array of colors.
   * - If the color is moved into a position that is behind its old position, the first section of the newly ordered array contains all elements of the previous array up to the newIndex, the color being moved is placed right afterwards, then the rest of the array is sliced and put in.
   * - If the color is moved into a position that is after its old position, the first section of the newly ordered array contains all elements from start up to the oldIndex, second section contains all elements from the oldIndex (including whichever element is at the oldIndex) up to the newIndex (including the newIndex), then the moved color is placed right afterwards and the rest of the array is sliced and put in.
   * - Finally sets state to update the colors array (in state).
   */

   // TODO: MOVE HELPER FUNCTION (TO MOVE ELEMS IN ARRAY) TO A SEPARATE HELPER FUNCTIONS FILE

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(st => {
      const { colors } = st;
      let newOrder;
      let movingColor = colors[oldIndex];
      let isPosBackwards = oldIndex > newIndex;

      if (isPosBackwards) {
        newOrder = [...colors.slice(0, newIndex), movingColor, ...colors.slice(newIndex, oldIndex), ...colors.slice(oldIndex + 1)]
      } else {
        newOrder = [...colors.slice(0, oldIndex), ...colors.slice(oldIndex + 1, newIndex + 1), movingColor, ...colors.slice(newIndex + 1)]
      }

      return { colors: newOrder };

    });

  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  }

  handleDrawerClose = () => {
    this.setState({ open: false });
  }

  handleChange = evt => {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSubmit = (newPaletteName) => {
    const { savePalette, history, colors } = this.props;
    const newPalette = {
      paletteName: newPaletteName,
      id: newPaletteName.toLowerCase().replace(/ /g, '-'),
      colors
    }
    savePalette(newPalette);
    history.push('/');
  }

  addNewColor = (currentColor, newColorName) => {
    let newColor = { color: currentColor, name: newColorName };
    this.setState(st => (
      { colors: [...st.colors, newColor] }
    ));
  }

  deleteColor = (colorName) => {
    this.setState({
      colors: this.state.colors.filter(color => color.name !== colorName)
    });
  }

  getRandomColor = () => {
    const { palettes } = this.props;

    // banish this code to hell
    // const randPaletteI = Math.floor(Math.random() * palettes.length);
    // const randomPalette = palettes[randPaletteI];
    // const getColorI = () => (Math.floor(Math.random() * palettes[randPaletteI].colors.length));
    // let randomColor = randomPalette.colors[getColorI()];
    // let dupeColors = colors.filter(color => color.includes(randomColor))
    // if (dupeColors !== []) randomColor = randomPalette.colors[getColorI()];
    
    // an array containing all of the colors (flattened)
    const allColors = palettes.map(p => p.colors).flat();
    // a filtered array containing all of the colors NOT included in the current colors array in state
    let filteredArr = allColors.filter(color => !this.state.colors.includes(color));
    const randomColor = filteredArr[Math.floor(Math.random() * filteredArr.length)];

    this.setState(st => ({
      colors: [...st.colors, randomColor]
    }));

  }

  clearPalette = () => {
    this.setState({ colors: [] });
  }

  render() {
    const { classes, palettes, savePalette, history } = this.props;
    const {
      open,
      colors
    } = this.state;
    // colors cannot be added to palette if number of colors exceeds 20
    // used for setting disabled attr in buttons Add Color and Random Color
    const paletteFull = colors.length > 19;

    return (
      <div className={classes.root}>
        <GlobalStyle />
        <PaletteFormNav
          open={open}
          palettes={palettes}
          handleDrawerOpen={this.handleDrawerOpen}
          savePalette={savePalette}
          history={history}
          colors={colors}
          />
        <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <Typography variant='h4' className={classes.title}>
              Design Your Palette
            </Typography>
            <IconButton onClick={this.handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>

          <Divider />

          <div className={classes.drawerContent}>
            <ColorPickerForm 
              paletteFull={paletteFull}
              colors={colors}
              addNewColor={this.addNewColor}
            />
            <div className={classes.subButtonContainer}>
              <Button
                className={classes.subButton}
                variant='outlined'
                color='inherit'
                onClick={this.clearPalette}
              >
                Clear Palette
              </Button>
              <Button
                className={classes.subButton}
                variant='outlined'
                color='inherit'
                onClick={this.getRandomColor}
                disabled={paletteFull}
              >
                Random Color
              </Button>
            </div>

          </div>
          
          
        </Drawer>
        <main
          className={clsx(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
          <DraggableColorList
            colors={colors}
            deleteColor={this.deleteColor}
            axis='xy'
            distance={2}
            onSortEnd={this.onSortEnd}
            />
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(NewPaletteForm);