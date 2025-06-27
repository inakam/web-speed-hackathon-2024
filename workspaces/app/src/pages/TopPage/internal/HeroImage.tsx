import styled from 'styled-components';

const _Picture = styled.picture`
  display: inline-block;
  width: 100%;
`;

const _Image = styled.img`
  display: inline-block;
  aspect-ratio: 16 / 9;
  width: 100%;
`;

export const HeroImage: React.FC = () => {
  return (
    <_Picture>
      <source srcSet="./assets/heroImage.webp" type="image/webp" />
      <_Image alt="Cyber TOON" loading="eager" src="./assets/heroImage.png" />
    </_Picture>
  );
};
