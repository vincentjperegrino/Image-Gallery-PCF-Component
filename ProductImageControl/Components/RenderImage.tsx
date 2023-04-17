import * as React from 'react';
import { Image, IImageProps, ImageFit } from '@fluentui/react/lib/Image';
import ISource from '../Interfaces/ISource';

/**
 * Renders item image
 */
const RenderImage: React.FC<ISource> = ({ imgsrc }) => {

  const imageProps: IImageProps = {
    imageFit: ImageFit.contain,
    src: imgsrc,
    styles: props => ({ root: { border: '1px solid ' + props.theme.palette.neutralSecondary } }),
  };

  return (
    <div>
      <Image
        {...imageProps}
        alt='Image not available'
        width={200}
        height={200}
      />
    </div>
  );
};

export default RenderImage;