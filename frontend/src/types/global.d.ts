// src\types\global.d.ts
declare module 'react-rating' {
  import { Component } from 'react';
  
  interface RatingProps {
    initialRating?: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
    emptySymbol?: React.ReactNode;
    fullSymbol?: React.ReactNode;
    fractions?: number;
    quiet?: boolean;
    direction?: 'ltr' | 'rtl';
    start?: number;
    stop?: number;
    step?: number;
  }
  
  export default class Rating extends Component<RatingProps> {}
}

declare module 'react-multi-carousel' {
  import { Component } from 'react';
  
  interface ResponsiveType {
    [key: string]: {
      breakpoint: { max: number; min: number };
      items: number;
      slidesToSlide?: number;
    };
  }
  
  interface CarouselProps {
    responsive: ResponsiveType;
    children: React.ReactNode;
    infinite?: boolean;
    autoPlay?: boolean;
    autoPlaySpeed?: number;
    keyBoardControl?: boolean;
    customTransition?: string;
    transitionDuration?: number;
    containerClass?: string;
    removeArrowOnDeviceType?: string | string[];
    deviceType?: string;
    dotListClass?: string;
    itemClass?: string;
    sliderClass?: string;
    arrows?: boolean;
    renderArrowsWhenDisabled?: boolean;
    renderButtonGroupOutside?: boolean;
    renderDotsOutside?: boolean;
  }
  
  export default class Carousel extends Component<CarouselProps> {}
}

declare module 'emoji-picker-react' {
  interface EmojiClickData {
    emoji: string;
    names: string[];
    originalUnified: string;
    unified: string;
  }

  interface PreviewConfig {
    defaultCaption?: string;
    defaultEmoji?: string;
    showPreview?: boolean;
  }
  
  interface EmojiPickerProps {
    onEmojiClick?: (emojiData: EmojiClickData) => void;
    autoFocusSearch?: boolean;
    defaultSkinTone?: string;
    disableAutoFocus?: boolean;
    disableSearchBar?: boolean;
    disableSkinTonePicker?: boolean;
    emojiStyle?: string;
    height?: number | string;
    width?: number | string;
    lazyLoadEmojis?: boolean;
    previewConfig?: PreviewConfig;
    searchDisabled?: boolean;
    searchPlaceholder?: string;
    skinTonesDisabled?: boolean;
    theme?: string;
  }
  
  export default function EmojiPicker(props: EmojiPickerProps): JSX.Element;
}

// Suppress lodash and prop-types errors if not using them directly
declare module 'lodash';
declare module 'prop-types';