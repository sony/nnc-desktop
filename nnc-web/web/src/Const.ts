/* Copyright 2024 Sony Group Corporation. */
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

interface IPages {
  DASHBOARD: string;
  PROJECT: string;
  DATASET: string;
  COMPUTE_RESOURCE: string;
  JOB_HISTORY: string;
  SAMPLE_PROJECT: string;
  PIPELINE: string;
  SERVICE_SETTINGS: string;
}

export const PAGES: IPages = {
  DASHBOARD: 'dashboard',
  PROJECT: 'project',
  DATASET: 'dataset',
  COMPUTE_RESOURCE: 'computeResource',
  JOB_HISTORY: 'jobHistory',
  SAMPLE_PROJECT: 'sampleProject',
  PIPELINE: 'pipeline',
  SERVICE_SETTINGS: 'serviceSettings'
};

export const DEFAULT_DOWNLOAD_FILE_NAME: string = 'result.nnp';

export const PIPELINE_SCRIPT: {PRE_PROCESS: string, POST_PROCESS: string} = {
  PRE_PROCESS: 'preprocess.py',
  POST_PROCESS: 'postprocess.py'
};

export const ROLE_LIST: {
  key: string,
  value: string
}[] = [
  {
    key: 'user',
    value: 'user'
  }
];

export const INSTANCE_TYPE_LIST: {
  key: string,
  value: string
}[] = [
  {
    key: 'remoteResG',
    value: 'remoteResG'
  }
]

export const remoteResG_MAX_GPU_NUM: number = 8

const color = {
  system3: 'rgb(255, 102, 102)',
  gray0: 'rgb(255, 255, 255)',
  gray1: 'rgb(242, 242, 242)',
  gray4: 'rgb(132, 132, 132)',
  gray5: 'rgb(38, 38, 38)',
  layer3: 'rgb(122, 153, 122)'
};

export const CONFIGURATION_FORMAT: {
  SDCPROJ: string,
  CONFIGURATION: string
} = {
  SDCPROJ: 'sdcproj',
  CONFIGURATION: 'configuration'
};

export const DEFINITIONS: any = {
  EDIT: {
    SVG_ID: 'svg#network-editor',
    GRID: {
      RADIUS: 1,
      SIZE: 20
    },
    CONNECTOR: {
      IN: 'in',
      OUT: 'out',
      ACCEPTS: {
        MULTIPLE: 'Multiple',
        NONE: 'None',
        SINGLE: 'Single'
      }
    },
    LINK: {
      STROKE_COLOR: color.gray5,
      DEFAULT: {
        STROKE_WIDTH: 2
      },
      FOCUSED: {
        STROKE_WIDTH: 3,
        STROKE_COLOR: color.system3
      },
      FOCUSED_DRAG: {
        STROKE_WIDTH: 2,
        STROKE_COLOR: color.system3
      }
    },
    LAYER: (() => {
      const GRID = 20; // XXX should be changed to refer this EDIT.GRID.SIZE
      const WIDTH = GRID * 10;
      const HEIGHT = GRID * 2;

      return {
        RECT_WIDTH: WIDTH,
        RECT_HEIGHT: HEIGHT,
        RECT_BORDER_WIDTH: 1,

        UNIT: {
          OFFSET_X: 4,
          OFFSET_Y: 4,
          WIDTH: 32,
          HEIGHT: 32,
          IMAGE_SOURCE: '/console/image/UnitWhite.svg'
        },

        WARN: {
          OFFSET_X: -8,
          OFFSET_Y: 11,
          WIDTH: 16,
          HEIGHT: 16,
          IMAGE_SOURCE: '/console/image/Warning.svg'
        },

        DROPCAP_CHAR: {
          OFFSET_X: GRID * 1,
          OFFSET_Y: 32,
          FONTCOLOR: 'white',
          FONTSIZE: '32px',
          OPACITY: 0.5,
          TEXT_ANCHOR: 'middle'
        },

        NAME_LABEL: {
          OFFSET_X: 0,
          OFFSET_Y: 12,
          FONTCOLOR: 'white',
          FONTSIZE: '12px'
        },

        PROPERTY_LABEL: {
          OFFSET_X: 0,
          OFFSET_Y: GRID + 8,
          FONTCOLOR: 'white',
          FONTSIZE: '11px',
          OPACITY: 1
        },

        CONNECTOR: {
          OFFSET_X: WIDTH / 2,
          OUTPIN_OFFSET_Y: HEIGHT,
          RADIUS: 4,
          JOIN_RADIUS: 2,
          STROKE_COLOR: color.gray5,
          STROKE_WIDTH: 2, // リンク接続ありのコネクタとサイドコネクタは円に枠を付けている

          SIDE: {
            RADIUS: 10,
            OPACITY: 0.5,
            FILL_COLOR: 'gray',
            START_OFFSET_X: 186,
            START_OFFSET_Y: 26,
            MARGIN_X: 16,
            MARGIN_Y: 13,
            LABEL: {
              OFFSET_X: 1,
              OFFSET_Y: 3,
              FONTCOLOR: 'white',
              FONTSIZE: '9px',
              FONTWEIGHT: 'bold',
              OPACITY: 0.75
            }
          }
        },

        STATISTICS: {
          BAR: {
            OFFSET_X: WIDTH + 4,
            OFFSET_Y: GRID * 2 - 4,
            WIDTH: 0,
            MAXWIDTH: GRID * 3, // レイヤー統計量（レイヤー右側のバー）
            HEIGHT: 4, // レイヤー統計量（レイヤー右側のバー）
            FILL_COLOR: color.gray4
          },
          LABEL: {
            OFFSET_X: WIDTH + 4,
            OFFSET_Y: GRID * 2 - 8,
            FONTCOLOR: color.gray5,
            PARAMFONTCOLOR: color.layer3,
            FONTSIZE: '12px'
          }
        },

        ORDER: {
          FONTCOLOR: color.gray5,
          FONTSIZE: '12px',
          OFFSET_X: (WIDTH / 2) + 5,
          OFFSET_Y: HEIGHT + 15
        },

        REPEAT: {
          FONTCOLOR: color.gray5,
          FONTSIZE: '12px',
          OFFSET_X: WIDTH + 4,
          OFFSET_Y: GRID - 5
        },

        BOUNDING_BOX: {
          WIDTH: WIDTH + GRID * 4,
          HEIGHT: HEIGHT
        },

        FRAME: {
          WIDTH: WIDTH,
          HEIGHT: HEIGHT,
          FILL_COLOR: 'none',
          STROKE_WIDTH: 1,
          DEFAULT: {
            STROKE_COLOR: null,
            FILTER_URL: null
          },
          FOCUSED: {
            STROKE_COLOR: color.system3,
            FILTER_URL: 'url(#frameshadow)'
          }
        },

        DESTINATION_FRAME: {
          WIDTH: WIDTH,
          HEIGHT: HEIGHT,
          FILL_COLOR: 'none',
          STROKE_COLOR: color.gray1,
          STROKE_WIDTH: 2
        },

        CLIP_PATH: {
          ID: 'nnc-layer-text-clipper',
          WIDTH: GRID * 8,
          HEIGHT: (GRID - 4) * 2,
          OFFSET_X: GRID * 2,
          OFFSET_Y: 4
        },

        COMMENT: {
          FILL_COLOR: color.gray0,
          FONT_SIZE: '14px'
        }
      };
    })(),
    LASSO: {
      FILL_COLOR: 'none',
      STROKE_COLOR: 'gray',
      STROKE_WIDTH: 2
    }
  }

};

export const LANGUAGES: {
  value: string, label: string
}[] = [
  {
    value: 'en',
    label: 'English'
  }, {
    value: 'ja',
    label: '日本語'
  }
];

export const SELECTOPTIONS: {
  key: {[key: string]: string},
  value: string
}[] = [
  {
    key: {
      en: 'Date uploaded',
      ja: 'アップロード日'
    },
    value: '-create_datetime'
  }, {
    key: {
      en: 'Popularity by copy count',
      ja: '人気(コピー数)'
    },
    value: '-copy_count'
  }, {
    key: {
      en: 'Likes',
      ja: 'お気に入り'
    },
    value: '-star_count'
  }
];

export const SELECTOPTIONSFORPUBLIC: {
  key: {[key: string]: string},
  value: string
}[] = [
  {
    key: {
      en: 'Date uploaded',
      ja: 'アップロード日'
    },
    value: '-update_datetime'
  }, {
    key: {
      en: 'Popularity by copy count',
      ja: '人気(コピー数)'
    },
    value: '-copy_count'
  }, {
    key: {
      en: 'Likes',
      ja: 'お気に入り'
    },
    value: '-star_count'
  }
];

export const TIME_20191001: number = 1569855600000;
export const DATE_201910: number = 201910;

export const TAX_RATE: {AFTER_20191001: number, BEFORE_20191001: number} = {
  AFTER_20191001: 0.1,
  BEFORE_20191001: 0.08
};

// MBとGBのどちらで表示するかの境界値
export const STORAGE_UNIT_BORDER = 1000;

