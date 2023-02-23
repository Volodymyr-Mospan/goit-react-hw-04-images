import { React, Component } from 'react';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { addImages } from 'services/api';

export class App extends Component {
  state = {
    images: [],
    query: '',
    page: 1,
    totalHits: 0,
    isLoading: false,
    error: null,
  };

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.query !== prevState.query) {
      this.setState({ images: [], isLoading: true });

      try {
        const result = await addImages(this.state.query, 1);

        this.setState({
          images: result.hits,
          page: 1,
          totalHits: result.totalHits,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        this.setState({
          images: [],
          page: 1,
          totalHits: 0,
          isLoading: false,
          error: error,
        });
      }
    }
  }

  loadMore = async () => {
    const { query, page } = this.state;
    this.setState({ isLoading: true });
    const result = await addImages(query, page + 1);
    this.setState(prevState => ({
      images: [...prevState.images, ...result.hits],
      page: prevState.page + 1,
      isLoading: false,
    }));
  };

  handleSearch = query => {
    this.setState({ query });
  };

  render() {
    const { images, page, totalHits, isLoading, error } = this.state;
    const maxPage = Math.ceil(totalHits / 12);

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridGap: '16px',
          paddingBottom: '24px',
        }}
      >
        <Searchbar onSabmit={this.handleSearch} />

        {error && !isLoading && (
          <h1
            style={{
              margin: '25px auto',
            }}
          >
            {error.message}
          </h1>
        )}

        {!!images.length && <ImageGallery images={images} />}

        {isLoading && <Loader />}

        {!!images.length && page < maxPage && !isLoading && (
          <Button onClick={this.loadMore} isLoading={isLoading} />
        )}
      </div>
    );
  }
}
