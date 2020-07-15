import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AudioPlayer from 'react-audio-player';
import Container from '@material-ui/core/Container';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  header: {
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  content: {
    textAlign: 'center',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
    margin: theme.spacing(3),
  },
  audioPlayer: {
    margin: theme.spacing(1),
  },
  withPadding: {
    padding: theme.spacing(3),
  },
}));

export default function ArtworkCloseUpCard(props) {
  const classes = useStyles();

  const subheaderTypographyProps = {color: 'textSecondary'};

  const id = props.match.params.id;
  const artworks = useSelector((state) => (state.museumArtworks.artworks));
  const artwork = artworks.get(id);
  const title = artwork.get('title');
  const artist = artwork.get('artist');
  const alt = artwork.get('alt');
  const description = artwork.get('description');
  const department = artwork.get('department');

  useEffect(() => {
    const descriptionElement = document.getElementById('description');
    descriptionElement.innerHTML = description;
    const strippedDescription = descriptionElement.innerText;
    const audioText = `This is a piece from the ${department} collection 
        titled ${title} by ${artist}. 
        It is ${alt}. ${strippedDescription}`;

    const params = new URLSearchParams();
    params.append('text', audioText);
    params.append('id', id);
    fetch('/api/v1/tts', {method: 'POST', body: params})
        .then((response) => response.text())
        .then((blobKey) => document.getElementById('audio')
            .setAttribute('src', `/api/v1/get-blob?blob-key=${blobKey}`));
  }, [artwork, id, alt, artist, department, description, title]);

  return (
    <Container className={classes.withPadding}>
      <Card className={classes.root}>
        <CardHeader
          title={title}
          subheader={artist}
          subheaderTypographyProps={subheaderTypographyProps}
          className={classes.header}
          action={
            <>
              <br/>
              <AudioPlayer controls id="audio" className={classes.audioPlayer}/>
            </>
          }
        />
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={4}
          className={classes.root}
        >
          <Grid item xs={12} md={8}>
            <CardMedia
              className={classes.media}
              image={artwork.get('url')}
              title={artist}
            />
            <CardContent>
              <Typography
                variant="body2"
                color="primary"
                align="center"
                component="p"
              >
                {alt}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={12} md={4}>
            <CardContent className={classes.content}>
              <Typography
                variant="h4"
                color="primary"
                component="h2"
                align="center"
                gutterBottom
              >
                  Description</Typography>
              <Typography id="description" align="left" paragraph>
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}

ArtworkCloseUpCard.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
