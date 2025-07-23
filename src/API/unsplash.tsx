const accessKey = 'xBmuatPSfYlYR65_-lpuk6KnJ3wAVr4Hs67_jgGKpZg';

export let imagesArray = [] as {
  id: string;
  alt_description?: string;
  urls: {
    thumb: string;
    regular?: string;
  };
}[];

export const fetchUnsplashImages = async () => {
  const res = await fetch(`https://api.unsplash.com/photos/random?count=6&client_id=${accessKey}`);
    const data = await res.json(); 
    imagesArray = data; 
    console.log(imagesArray);
};

