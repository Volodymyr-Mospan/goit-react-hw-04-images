import { React, useState, useEffect } from 'react';
import { Searchbar } from 'components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { Button } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { addImages } from 'services/api';

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPsge] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      return;
    }

    setImages([]);
    setIsLoading(true);

    const fetchImages = async () => {
      try {
        const result = await addImages(query, 1);
        setImages(result.hits);
        setPsge(1);
        setTotalHits(result.totalHits);
        setIsLoading(false);
        setError(null);
      } catch (error) {
        setImages([]);
        setPsge(1);
        setTotalHits(0);
        setIsLoading(false);
        setError(error);
      }
    };

    fetchImages();
  }, [query]);

  const loadMore = async () => {
    setIsLoading(true);
    const result = await addImages(query, page + 1);
    setImages([...images, ...result.hits]);
    setPsge(page + 1);
    setIsLoading(false);
  };

  const handleSearch = query => {
    setQuery(query);
  };

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
      <Searchbar onSabmit={handleSearch} />

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
        <Button onClick={loadMore} isLoading={isLoading} />
      )}
    </div>
  );
};
