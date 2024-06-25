/**
 * type of request data passed in request when creating new character or update basic character data
 * @example {"title":"Yuuta","description":"main character"}
 */
export interface RequestCharacter {
  /** character title */
  title: string;

  /** character description */
  description: string;
}

/**
 * single character image
 * @example {"originalName":"in-flames_owl_boy.png","url":"/files/1635858781056-in-flames_owl_boy.png","filename":"1635858781056-in-flames_owl_boy.png","_id":"6181395d67568b70180ce91b"}
 */
export interface CharacterImage {
  /** the original name before being sent to server */
  originalName: string;

  /** url to get character image */
  url: string;

  /** name of the resource under which you can find it on server */
  filename: string;

  /** resource id */
  _id: string;
}

/**
 * single character
 * @example {"_id":"6181395d67568b70180ce93b","title":"Yuuta","description":"main character","imagesList":[],"__v":0,"createdAt":"2021-11-04T11:01:42.143+00:00","updatedAt":"2021-11-04T11:01:42.143+00:00"}
 */
export interface Character {
  /** mongodb id */
  _id: string;

  /** scenery title */
  title: string;

  /** scenery description */
  description: string;

  /** array of character images */
  imagesList: CharacterImage[];

  /** mongodb __v */
  __v: number;

  /** create timestamp */
  createdAt: string;

  /** update timestamp */
  updatedAt: string;
}

/**
 * returns list of characters (if no filters specified, returns first 5 characters)
 */
export interface CharactersResponse {
  /** list of characters */
  data: Character[];

  /** number of total characters */
  totalItems: number;
}
