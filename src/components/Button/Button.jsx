import { ButtonStl } from './Button.styled';

export const Button = ({ onClick }) => {
  return (
    <ButtonStl type="button" onClick={onClick}>
      Load More
    </ButtonStl>
  );
};
