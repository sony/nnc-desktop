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

import swal from 'sweetalert2';
import { ITenantObj } from '../store/state/tenant';
import text from '../messages/Text';
import store from '../store/index';
import {StringUtil} from '../util/StringUtil';
import { remoteResG_MAX_GPU_NUM } from '../Const';
import { IremoteResGForm } from '../store/state/computeResource';
// import { FileUtil } from '../util/FileUtil';

const MAX_USER_ID_LENGTH: number = 20;

export interface IUsedInstanceDetail {
  processor: string;
  time: string;
  amount: string;
}

export class SwalUtil {

  public static hideDialog(onComplete?: () => void): void {
    swal.close(onComplete);
  }

  public static alert(message: string, callback?: () => void, buttonId?: string, buttonName?: string): void {
    if (!message) {
      return;
    }

    const callbackFunc: () => void = callback && typeof callback === 'function' ? callback : () => {
      return;
    };

    swal({
      text: message,
      customClass: 'alert',
      width: '43.2rem',
      padding: 16,
      animation: false,
      showConfirmButton: true,
      confirmButtonText: buttonName || 'OK',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer',
      reverseButtons: true,
      buttonsStyling: false,
      onOpen: () => {
        const confirmButton: HTMLElement = swal.getConfirmButton();
        confirmButton.setAttribute('id', buttonId || 'confirm-button');
      }
    }).then(() => {
      callbackFunc();
    }, () => {
      callbackFunc();
    });
  }

  public static inferLimitAlert(callback?: () => void, buttonId?: string, buttonName?: string): void {
    const callbackFunc: () => void = callback && typeof callback === 'function' ? callback : () => {
      return;
    };
    const firstMessage: string = text[store.state.common.language].dialogTexts.YOU_REACHED_TO_INFER_LIMIT1;
    const secondMessage: string = text[store.state.common.language].dialogTexts.YOU_REACHED_TO_INFER_LIMIT2;
    const thirdMessage: string = text[store.state.common.language].dialogTexts.YOU_REACHED_TO_INFER_LIMIT3;

    const isJapanese: boolean = store.state.common.language === 'ja';
    let html: string = ``;

    if (isJapanese) {
      html += `<div class="credit-limit-msg">${firstMessage}<a href="https://dl.sony.com/ja/business/" target="_blank">${secondMessage}</a> ${thirdMessage}
      </div>
      </div>`;
    } else if (!isJapanese) {
      html += `<div class="credit-limit-msg">${firstMessage}<a href="https://dl.sony.com/ja/business/" target="_blank">${secondMessage}</a>
      </div>
      </div>`;
    }

    swal({
      html: html,
      width: '43.2rem',
      padding: 16,
      animation: false,
      showConfirmButton: true,
      confirmButtonText: buttonName || 'OK',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer',
      reverseButtons: true,
      buttonsStyling: false,
      onOpen: () => {
        const confirmButton: HTMLElement = swal.getConfirmButton();
        confirmButton.setAttribute('id', buttonId || 'confirm-button');
      }
    }).then(() => {
      callbackFunc();
    }, () => {
      callbackFunc();
    });
  }

  public static confirm(message: string, callback?: () => void, cancelCallback?: () => void): void {
    if (!message) {
      return;
    }

    swal({
      text: message,
      width: '43.2rem',
      padding: 16,
      animation: false,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#D8D8D8',
      cancelButtonClass: 'pointer',
      focusCancel: true,
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer',
      focusConfirm: false,
      reverseButtons: true,
      buttonsStyling: false
    }).then(() => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    }, () => {
      if (cancelCallback && typeof cancelCallback === 'function') {
        cancelCallback();
      }
    });
  }

  public static prompt(info: {message: string, defaultText?: string} , callback?: (response: string) => void, cancelCallback?: () => void): void {
    if (!info.message) {
      return;
    }

    swal({
      text: info.message,
      width: '43.2rem',
      padding: 16,
      animation: false,
      input: 'text',
      inputValue: info.defaultText || '',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#D8D8D8',
      cancelButtonClass: 'pointer',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer',
      reverseButtons: true,
      buttonsStyling: false
    }).then((response: any) => {
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    }, () => {
      if (cancelCallback && typeof cancelCallback === 'function') {
        cancelCallback();
      }
    });
  }

  public static selectAccount(message: string, callback?: () => void, cancelCallback?: () => void): void {
    if (!message) {
      return;
    }

    swal({
      text: message,
      width: '43.2rem',
      padding: 16,
      animation: false,
      showCancelButton: true,
      cancelButtonText: 'Google',
      cancelButtonColor: '#006699',
      cancelButtonClass: 'pointer google',
      focusCancel: false,
      showConfirmButton: true,
      confirmButtonText: 'Sony',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer sony',
      focusConfirm: false,
      reverseButtons: true,
      buttonsStyling: false,
      allowOutsideClick: false,
      onOpen: () => {
        const cancelButton: HTMLElement = swal.getCancelButton();
        if (cancelButton && cancelButton.blur) {
          cancelButton.blur();
        }
      }
    }).then(() => {
      if (callback && typeof callback === 'function') {
        callback();
      }
    }, () => {
      if (cancelCallback && typeof cancelCallback === 'function') {
        cancelCallback();
      }
    });
  }

  public static select(info: {message: string, selected: string, selectList: {key: string, value: string}[]} , callback?: (response: string) => void, cancelCallback?: () => void): void {
    if (!info.message) {
      return;
    }

    const createSelectBox = (): string => {
      if (!info.selectList || info.selectList.length <= 1) {
        return '';
      }
      let select: string = `<div><label class="select-label"><select id="select-list" class="select-menu">`;
      info.selectList.forEach((obj: {key: string, value: string}) => {
        select += `<option value=${obj.value}>${obj.key}</option>`;
      });
      select += `</select></label></div>`;
      return select;
    };

    const html: string = `
      <div>
        <div class="message">${info.message}</div>
        ${createSelectBox()}
      </div>
    `;

    swal({
      text: info.message,
      customClass: 'swal-select-area',
      width: '43.2rem',
      padding: 16,
      animation: false,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#D8D8D8',
      cancelButtonClass: 'pointer',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer',
      reverseButtons: true,
      buttonsStyling: false,
      html: html,
      onBeforeOpen: () => {
        const selectElement: HTMLSelectElement | null = document.getElementById('select-list') as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = info.selected;
        }
      },
      preConfirm: () => {
        const selectElement: HTMLSelectElement | null = document.getElementById('select-list') as HTMLSelectElement;
        return Promise.resolve((selectElement || {}).value);
      }
    }).then((response: any) => {
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    }, () => {
      if (cancelCallback && typeof cancelCallback === 'function') {
        cancelCallback();
      }
    });
  }

  public static inputUserId(info: {message: string, defaultText?: string} , callback?: (response: string) => void, cancelCallback?: () => void): void {
    if (!info.message) {
      return;
    }
    let notInput = true;

    swal({
      text: info.message,
      customClass: 'input-name-area',
      width: '43.2rem',
      padding: 16,
      animation: false,
      input: 'text',
      inputValue: info.defaultText || '',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#D8D8D8',
      cancelButtonClass: 'pointer',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer',
      reverseButtons: true,
      buttonsStyling: false,
      onOpen: () => {
        const input: any = swal.getInput();
        const disableConfirmButton: any = () => {
          swal.disableConfirmButton();
        };
        const enableConfirmButton: any = () => {
          swal.enableConfirmButton();
        };
        const update = () => {
          if (input.value.length < 1 && notInput) {
            disableConfirmButton();
            swal.resetValidationError();
          } else if ((input.value.length < 1 && !notInput) || input.value.length > MAX_USER_ID_LENGTH) {
            swal.showValidationError(text[store.state.common.language].dialogTexts.USER_ID_IS_TOO_SHORT_OR_LONG);
            disableConfirmButton();
          } else if (!input.value.match(/^\d+$/g)) {
            swal.showValidationError(text[store.state.common.language].dialogTexts.INVALID_CHARACTER_INCLUDED);
            disableConfirmButton();
          } else {
            swal.resetValidationError();
            enableConfirmButton();
          }
        };
        input.oninput = () => {
          notInput = false;
          update();
        };
        update();
      }
    }).then((response: any) => {
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    }, () => {
      if (cancelCallback && typeof cancelCallback === 'function') {
        cancelCallback();
      }
    });
  }

  public static inputName(info: {message: string, defaultText?: string, tenantList?: ITenantObj[], isPublic?: boolean}, callback?: (name: string, tenantId?: string) => void, cancelCallback?: () => void, maxLength?: number): void {
    const DEFAULT_MAX_LENGTH: number = 255;
    if (!info.message) {
      return;
    }

    let notInput = true;
    const pleaseReadAndAccept: string = text[store.state.common.language].dialogTexts.PLEASE_READ_AND_ACCEPT_THE;
    const noticeOnUse: string = text[store.state.common.language].dialogTexts.NOTICE_ON_USE_PUBLIS_PROJECT;
    const isJapanese: boolean = store.state.common.language === 'ja';
    let noteEle: string = ``;

    const createSelectBox = (): string => {
      if (!info.tenantList || info.tenantList.length <= 1) {
        return '';
      }
      const selectMessage: string = text[store.state.common.language].dialogTexts.SELECT_WORKSPACE;
      const warningMessage: string = text[store.state.common.language].dialogTexts.CHARGED_TO_PERSONAL;
      let select: string = `<div><div>${selectMessage}</div><label class="select-label"><select id="select-tenant" class="select-menu">`;
      info.tenantList.forEach((tenant: ITenantObj) => {
        select += `<option value=${tenant.tenantId}>
          ${tenant.isLocal ? 'Personal' : tenant.nickname}
        </option>`;
      });
      select += `</select></label>
      </div><div id="local-tenant-warning">
        ${warningMessage}
      </div>`;
      return select;
    };

    const html: string = `
      <div>
        ${noteEle}
        <div style="white-space: pre-wrap;">${info.message}</div>
        <input type="text" id="input-project-name" class="swal2-input" style="display: block;" value="${info.defaultText || ''}">
        <div id="input-project-name-error" class="swal2-validationerror"></div>
        ${createSelectBox()}
      </div>
    `;

    swal({
      customClass: 'input-name-area',
      width: '43.2rem',
      padding: 16,
      animation: false,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#D8D8D8',
      cancelButtonClass: 'pointer',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer',
      reverseButtons: true,
      buttonsStyling: false,
      inputAutoTrim: false,
      html: html,
      onOpen: () => {
        const input: HTMLInputElement | null = document.getElementById('input-project-name') as HTMLInputElement;
        const errorArea: HTMLElement | null = document.getElementById('input-project-name-error');
        const warningArea: HTMLElement | null = document.getElementById('local-tenant-warning');
        const selectTenant: HTMLSelectElement | null = document.getElementById('select-tenant') as HTMLSelectElement;
        if (!input || !errorArea) {
          return;
        }
        const disableConfirmButton: any = () => {
          swal.disableConfirmButton();
        };
        const enableConfirmButton: any = () => {
          swal.enableConfirmButton();
        };
        const update = () => {
          const errorMsgShortOrLong: string = text[store.state.common.language].dialogTexts.NAME_IS_TOO_SHORT_OR_LONG;
          const errorMsgInvalid: string = text[store.state.common.language].dialogTexts.INVALID_CHARACTER_INCLUDED;
          if (input.value.length < 1 && notInput) {
            disableConfirmButton();
            errorArea.style.display = 'none';
            errorArea.textContent = '';
            input.className = 'swal2-input';
          } else if ((input.value.length < 1 && !notInput) || input.value.length > (maxLength || DEFAULT_MAX_LENGTH)) {
            input.className = 'swal2-input swal2-inputerror';
            errorArea.style.display = 'block';
            errorArea.textContent = errorMsgShortOrLong;
            disableConfirmButton();
          } else if (input.value.match(/[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g)) {
            errorArea.style.display = 'block';
            errorArea.textContent = errorMsgInvalid;
            input.className = 'swal2-input swal2-inputerror';
            disableConfirmButton();
          } else {
            errorArea.style.display = 'none';
            errorArea.textContent = '';
            input.className = 'swal2-input';
            enableConfirmButton();
          }
        };
        input.oninput = () => {
          notInput = false;
          update();
        };
        update();

        if (warningArea && selectTenant) {
          const isSelectedLocalTenant = (selectedId: string) => {
            return ((info.tenantList || []).find((tenant: ITenantObj) => tenant.tenantId === selectedId) || {isLocal: false}).isLocal;
          };
          const updateWarningArea = (selectedId: string) => {
            if (isSelectedLocalTenant(selectedId)) {
              warningArea.style.display = 'block';
            } else {
              warningArea.style.display = 'none';
            }
          };

          selectTenant.onchange = (e: any) => {
            updateWarningArea(e.target.value);
          };

          updateWarningArea(selectTenant.value);
        }
      },
      preConfirm: () => {
        const input: HTMLInputElement | null = document.getElementById('input-project-name') as HTMLInputElement;
        const selectTenant: HTMLSelectElement | null = document.getElementById('select-tenant') as HTMLSelectElement;
        return Promise.resolve({
          name: input.value,
          id: (selectTenant || {}).value
        });
      }
    }).then((response: {name: string, id?: string}) => {
      if (callback && typeof callback === 'function') {
        callback(response.name, response.id);
      }
    }, () => {
      if (cancelCallback && typeof cancelCallback === 'function') {
        cancelCallback();
      }
    });
  }

  public static inputInstance(info: {message: string, selected: string, selectList: {key: string, value: string}[]}, callback: (res: IremoteResGForm, tenantId?: string) => void, cancelCallback?: () => void, maxLength?: number): void {
    const DEFAULT_MAX_LENGTH: number = 255;

    let untouched = true; //indicate initiated form was not modified
    // descriptions used in form
    const dialogTexts = text[store.state.common.language].dialogTexts;


    const createSelectBox = (): string => {
      // descriptions used in instance type select
      const dialogTexts = text[store.state.common.language].dialogTexts;
      let select: string = `<div><div>${dialogTexts.SELECT_INSTANCE_TYPE}</div><label class="select-label"><select id="select-instance-type" class="select-menu swal2-input">`;
      info.selectList.forEach((obj: {key: string, value: string}) => {
        select += `<option value=${obj.value}>${obj.key}</option>`;
      });
      select += `</select></label></div>`;
      return select;
    };

    const html: string = `
      <div>
        <div style="white-space: pre-wrap;">${info.message}</div>
        ${createSelectBox()}
        <div id="input-instance-remoteResG-type">
          <label for="input-remoteResG-id">
            <span>${dialogTexts.remoteResG_USER_ID}</span>
          </label>
          <input type="text" id="input-remoteResG-id" class="swal2-input" spellcheck="false" style="display: block;" value="">
          <div id="input-remoteResG-id-error" class="swal2-validationerror"></div>

          <label for="input-remoteResG-cert">
            <span>${dialogTexts.remoteResG_CERT_FILE}</span>
          </label>
          <input type="text" id="input-remoteResG-cert" class="swal2-input" spellcheck="false" style="display: block;" value="">
          <div id="input-remoteResG-cert-error" class="swal2-validationerror"></div>

          <label for="input-remoteResG-partition">
            <span>${dialogTexts.remoteResG_PARTITION_SPEC}</span>
          </label>
          <input type="text" id="input-remoteResG-partition" class="swal2-input" spellcheck="false" style="display: block;" value="">
          <div id="input-remoteResG-partition-error" class="swal2-validationerror"></div>

          <label for="input-remoteResG-gpu-num">
            <span>${dialogTexts.remoteResG_GPU_NUMBER}</span>
          </label>
          <input type="text" id="input-remoteResG-gpu-num" class="swal2-input" spellcheck="false" style="display: block;" value="">
          <div id="input-remoteResG-gpu-num-error" class="swal2-validationerror"></div>
        </div>
      </div>
    `;

    swal({
      customClass: 'input-name-area',
      width: '43.2rem',
      padding: 16,
      animation: false,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#D8D8D8',
      cancelButtonClass: 'pointer',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer',
      reverseButtons: true,
      buttonsStyling: false,
      inputAutoTrim: false,
      html: html,
      onOpen: () => {
        let checkGroup: {[key:string]: boolean} = {
          idCheck: false,
          certCheck: false,
          partitionCheck: false,
          gpuNumCheck: false
        }
        const platform = store.state.computeResourceGroup.platform;
        const disableConfirmButton = (checkGroup: {[key:string]: boolean}, key: string): void => {
          checkGroup[key] = false;
          swal.disableConfirmButton();
        };
        const enableConfirmButton = (checkGroup: {[key:string]: boolean}, key: string): void => {
          checkGroup[key] = true;
          if (Object.values(checkGroup).reduce((a, b)=> a && b)) {
            swal.enableConfirmButton();
          }
        };
        const addInputValidate: (input: HTMLInputElement | null, errorArea: HTMLElement | null, checkGroup:{[key:string]: boolean}, key: string, type?: string) => void = (input, errorArea, checkGroup, key, type='string') => {
          if (!input|| !errorArea) {
            return;
          }
          const normalReg = /[^a-zA-Z0-9_ !#$%&\'\()+,\.\-=@\[\]^`{}~]+/g;
          const numReg = /[^0-9]/g;
          const linuxPathReg = /\/.*/g;
          const winPathReg = /^[a-zA-Z]:\\(?:([^<>:"\/\\|?*]*[^<>:"\/\\|?*.]\\|..\\)*([^<>:"\/\\|?*]*[^<>:"\/\\|?*.]))?/g
          const isValueError = (value, type) => {
            switch (type) {
              case 'number':
                return value.match(numReg)
              case 'path':
                const res = value.match(platform == 'win32' ? winPathReg : linuxPathReg);
                return (res == null) || res[0].length != value.length;
              default:
                return value.match(normalReg)
            }
          };
          const update = () => {
            if (input.value.length < 1 && untouched) {
              disableConfirmButton(checkGroup, key);
              errorArea.style.display = 'none';
              errorArea.textContent = '';
              input.className = 'swal2-input';
            } else if ((input.value.length < 1 && !untouched) || input.value.length > (maxLength || DEFAULT_MAX_LENGTH)) {
              input.className = 'swal2-input swal2-inputerror';
              errorArea.style.display = 'block';
              errorArea.textContent = dialogTexts.NAME_IS_TOO_SHORT_OR_LONG;
              disableConfirmButton(checkGroup, key);
            } else if (isValueError(input.value, type)) {
              errorArea.style.display = 'block';
              errorArea.textContent = type == 'path' ? dialogTexts.INVALID_PATH : dialogTexts.INVALID_CHARACTER_INCLUDED;
              input.className = 'swal2-input swal2-inputerror';
              disableConfirmButton(checkGroup, key);
            } else if (type == 'number' && (parseInt(input.value) > remoteResG_MAX_GPU_NUM || parseInt(input.value) <=0)) {
              errorArea.style.display = 'block';
              errorArea.textContent = dialogTexts.remoteResG_GPU_NUM_LIMIT;
              input.className = 'swal2-input swal2-inputerror';
              disableConfirmButton(checkGroup, key);
            } else {
              errorArea.style.display = 'none';
              errorArea.textContent = '';
              input.className = 'swal2-input';
              enableConfirmButton(checkGroup, key);
            }
          };
          input.oninput = () => {
            untouched = false;
            update();
          };
          update();
        }

        addInputValidate(document.getElementById('input-remoteResG-id') as HTMLInputElement, document.getElementById('input-remoteResG-id-error'),
                         checkGroup, 'idCheck')
        addInputValidate(document.getElementById('input-remoteResG-partition') as HTMLInputElement,
                          document.getElementById('input-remoteResG-partition-error'),
                          checkGroup, 'partitionCheck')
        addInputValidate(document.getElementById('input-remoteResG-cert') as HTMLInputElement,
                          document.getElementById('input-remoteResG-cert-error'),
                          checkGroup, 'certCheck', 'path')
        addInputValidate(document.getElementById('input-remoteResG-gpu-num') as HTMLInputElement,
                          document.getElementById('input-remoteResG-gpu-num-error'),
                          checkGroup, 'gpuNumCheck', 'number')
      },
      preConfirm: () => {
        const result:any = ['input-remoteResG-id', 'input-remoteResG-cert', 'input-remoteResG-partition', 'input-remoteResG-gpu-num'].map(i => {
          const input: HTMLInputElement | null = document.getElementById(i) as HTMLInputElement || {};
          return input.value;
        })

        const selectType: HTMLSelectElement | null = document.getElementById('select-instance-type') as HTMLSelectElement;

        return Promise.resolve({
          type: (selectType || {}).value,
          userId: result[0],
          cert: result[1],
          partition: result[2],
          gpuNumber: parseInt(result[3])
        });
      }
    }).then((response: {type: string, userId: string, cert: string, partition: string, gpuNumber: number}) => {
      if (callback && typeof callback === 'function') {
        callback(response);
      }
    }, () => {
      if (cancelCallback && typeof cancelCallback === 'function') {
        cancelCallback();
      }
    });
  }

  public static showTOSPP(url: string, callback?: () => void): void {
    if (!url) {
      return;
    }

    const callbackFunc: () => void = callback && typeof callback === 'function' ? callback : () => {
      return;
    };

    const html: string = `<div class="tos-pp-frame"><iframe src="${url}"></iframe></div>`;

    swal({
      html: html,
      customClass: 'tos-area',
      width: '100%',
      padding: 0,
      animation: false,
      showConfirmButton: true,
      confirmButtonText: '利用規約に同意してはじめる',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer',
      reverseButtons: true,
      buttonsStyling: false,
      allowOutsideClick: false
    }).then(() => {
      callbackFunc();
    }, () => {
      callbackFunc();
    });
  }

  public static showIframe(url: string): void {
    if (!url) {
      return;
    }

    const html: string = `<div class="iframe-area"><iframe src="${url}"></iframe></div>`;

    swal({
      html: html,
      customClass: 'swal-iframe',
      width: '100%',
      padding: 0,
      animation: false,
      showConfirmButton: false,
      showCancelButton: false,
      allowOutsideClick: false
    });
  }

  public static setCreditLimit(initialLimit: number, minBudget: number, maxBudget: number, usedBudget: number, callback?: (creditLimit: string) => void): void {
    const callbackFunc: (creditLimit?: any) => void = callback && typeof callback === 'function' ? callback : () => {
      return;
    };
    let lowerLimit: number = Math.ceil(usedBudget / 1000) * 1000;
    lowerLimit = maxBudget < lowerLimit ? maxBudget : lowerLimit;
    const isJapanese: boolean = store.state.common.language === 'ja' ? true : false;
    const creditCardLimit: string = text[store.state.common.language].dialogTexts.CREDIT_CARD_LIMIT;
    const setUpMsg: string = StringUtil.format(text[store.state.common.language].dialogTexts.YOU_CAN_SET_UP_TO, maxBudget.toLocaleString());
    const contactUsMsg: string = text[store.state.common.language].dialogTexts.PLEASE_CONTACT_US;
    const inquryFrom: string = text[store.state.common.language].dialogTexts.THE_INQUIRY_FORM;
    const setAmountExceedMsg: string = StringUtil.format(text[store.state.common.language].dialogTexts.SET_THE_ANOUNT_EXCEED, maxBudget.toLocaleString());
    let html: string = `<div class="credit-limit">
      <p class="popup-title">${creditCardLimit}</p>
      <div id="credit-limit-value-area">
        <div><img id="credit-limit-minus-icon" class="slider-change-icon" src="/console/image/Minus.svg"></div>
        <div id="credit-limit-value">&yen; ${initialLimit.toLocaleString()}</div>
        <div><img id="credit-limit-plus-icon" class="slider-change-icon" src="/console/image/AddNewBlue.svg"></div>
      </div>
      <div id="credit-slider-area">
        <input id="creditSlider" type="range" value="${initialLimit}" min="${minBudget}" max="${maxBudget}"
        step="1000" list="datalists" class="range">
        <datalist id="datalists"></datalist>
        <div id="bar-base"></div>
        <div id="bar-active"></div>
        <div id="bar-non-active"></div>
      </div>
      <div id="scale-area"></div>
      <div class="scale-box">
        <div>${minBudget.toLocaleString()}</div>
        <div>${maxBudget.toLocaleString()}</div>
      </div>`;

    if (!isJapanese) {
      html += `<div class="credit-limit-msg" v-if="${!isJapanese}">
      ${setUpMsg} ${contactUsMsg} <a href="https://support.sonynetwork.co.jp/IoT/web/form113.html" target="_blank"> ${inquryFrom} </a> ${setAmountExceedMsg}
      </div>
      </div>`;
    } else if (isJapanese) {
      html += `<div class="credit-limit-msg" v-else-if="${isJapanese}">
      ${setUpMsg} ${setAmountExceedMsg} <a href="https://support.sonynetwork.co.jp/IoT/web/form113.html" target="_blank"> ${inquryFrom} </a> ${contactUsMsg}
      </div>
      </div>`;
    }

    swal({
      html: html,
      customClass: 'credit-limit-area',
      width: '43.2rem',
      padding: 16,
      animation: false,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#D8D8D8',
      cancelButtonClass: 'pointer',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer',
      focusCancel: true,
      reverseButtons: true,
      buttonsStyling: false,
      allowOutsideClick: false,
      preConfirm: () => {
        const input: any = document.getElementById('creditSlider');
        return Promise.resolve(input.value);
      },
      onOpen: (modalElement: any) => {
        const input: any = document.getElementById('creditSlider');
        const minusIcon: any = document.getElementById('credit-limit-minus-icon');
        const plusIcon: any = document.getElementById('credit-limit-plus-icon');

        const updateRange = (value: number) => {
          const activeWidth: number = 400 * ((value - minBudget) / (maxBudget - minBudget));
          const activeBar: any = document.getElementById('bar-active');
          activeBar.style.width = String(activeWidth / 10) + 'rem';

          const nonActiveWidth: number = 400 * ((lowerLimit - minBudget) / (maxBudget - minBudget));
          const nonActiveBar: any = document.getElementById('bar-non-active');
          nonActiveBar.style.width = String(nonActiveWidth / 10) + 'rem';

          const minusAfterValue: number = value - 1000;
          if (minusAfterValue < lowerLimit || minusAfterValue < minBudget) {
            // TODO 画像はあとで正しいものに変更
            minusIcon.src = '/console/image/Minus.svg';
            minusIcon.style.cursor = 'auto';
            minusIcon.style.opacity = 0.25;
          } else {
            minusIcon.src = '/console/image/MinusBlue.svg';
            minusIcon.style.cursor = 'pointer';
            minusIcon.style.opacity = 1;
          }

          const plusAfterValue: number = value + 1000;
          if (maxBudget < plusAfterValue) {
            // TODO 画像はあとで正しいものに変更
            plusIcon.src = '/console/image/AddNew.svg';
            plusIcon.style.cursor = 'auto';
            plusIcon.style.opacity = 0.25;
          } else {
            plusIcon.src = '/console/image/AddNewBlue.svg';
            plusIcon.style.cursor = 'pointer';
            plusIcon.style.opacity = 1;
          }

        };

        const updateBudgetValue = (budget: number) => {
          const value: any = document.getElementById('credit-limit-value');
          value.innerHTML = '&yen;' + ' ' + budget.toLocaleString();
        };

        input.oninput = (e: any) => {
          if (Number(e.target.value) < lowerLimit) {
            const slider: any = document.getElementById('creditSlider');
            slider.value = lowerLimit;
            updateBudgetValue(lowerLimit);
            updateRange(lowerLimit);
          } else {
            updateBudgetValue(Number(e.target.value));
            updateRange(Number(e.target.value));
          }
        };

        minusIcon.onclick = (e: any) => {
          const slider: any = document.getElementById('creditSlider');
          const value: number = Number(slider.value);
          const afterValue: number = (value - 1000) < minBudget ? minBudget : value - 1000;
          if (afterValue < lowerLimit || afterValue < minBudget) {
            return;
          }
          slider.value = afterValue;
          updateBudgetValue(afterValue);
          updateRange(afterValue);

        };

        plusIcon.onclick = (e: any) => {
          const slider: any = document.getElementById('creditSlider');
          const value: number = Number(slider.value);
          const afterValue: number = (value + 1000) > maxBudget ? maxBudget : value + 1000;
          if (afterValue > maxBudget) {
            return;
          }
          slider.value = afterValue;
          updateBudgetValue(afterValue);
          updateRange(afterValue);
        };

        const datalist: any = document.getElementById('datalists');
        for (let i = minBudget; i <= maxBudget; i += 1000) {
          const optionElement = document.createElement('option');
          optionElement.innerHTML = String(i);
          datalist.appendChild(optionElement);
        }

        const scaleNum: number = 21; // 1000円単位の場合は、20個の目盛を出す。
        const scaleArea: any = document.getElementById('scale-area');

        for (let i = 0; i < scaleNum; i++) {
          const divElement: any = document.createElement('div');
          switch (i) {
            case 0:
              divElement.setAttribute('class', 'side');
              divElement.setAttribute('style', 'left:0.2rem');
              break;
            case scaleNum - 1:
              divElement.setAttribute('class', 'side');
              divElement.setAttribute('style', 'left:39.8rem');
              break;
            default:
              const left: any = (400 / (scaleNum - 1) * i) / 10;
              divElement.setAttribute('style', 'left:' + left + 'rem');
              break;
          }
          scaleArea.appendChild(divElement);
        }

        updateRange(initialLimit);

      }
    }).then((creditLimit) => {
      if (callback && typeof callback === 'function') {
        callback(creditLimit);
      }
    }, () => {
      // do nothing.
    });
  }

  public static showCreditLimitForOverLimit(initialLimit: number, maxBudget: number): void {
    const contactUsMsg: string = text[store.state.common.language].dialogTexts.PLEASE_CONTACT_US;
    const creditCardLimit: string = text[store.state.common.language].dialogTexts.CREDIT_CARD_LIMIT;
    const setAmountExceedMsg: string = StringUtil.format(text[store.state.common.language].dialogTexts.SET_THE_ANOUNT_EXCEED, maxBudget.toLocaleString());
    const inquiryFromMsg: string = text[store.state.common.language].dialogTexts.THE_INQUIRY_FORM;
    const isJapanese: boolean = store.state.common.language === 'ja' ? true : false;
    const setUpMsg: string = StringUtil.format(text[store.state.common.language].dialogTexts.YOU_CAN_SET_UP_TO, maxBudget.toLocaleString());
    let html: string = `<div class="credit-limit">
      <p class="popup-title">${creditCardLimit}</p>
      <div id="credit-limit-value-area">
        <div id="credit-limit-value">&yen; ${initialLimit.toLocaleString()}</div>
      </div>
      <div id="credit-slider-area">
        <datalist id="datalists"></datalist>
        <div id="bar-base"></div>
      </div>
      <div id="scale-area"></div>`;

    if (!isJapanese) {
      html += `<div class="credit-limit-msg no-change" v-if="${!isJapanese}">
      ${setUpMsg} ${contactUsMsg} <a href="https://support.sonynetwork.co.jp/IoT/web/form113.html" target="_blank"> ${inquiryFromMsg} </a> ${setAmountExceedMsg}
      </div>
      </div>`;
    } else if (isJapanese) {
      html += `<div class="credit-limit-msg no-change" v-else-if="${isJapanese}">
      ${setUpMsg} ${setAmountExceedMsg} <a href="https://support.sonynetwork.co.jp/IoT/web/form113.html" target="_blank"> ${inquiryFromMsg} </a> ${contactUsMsg}
      </div>
      </div>`;
    }

    swal({
      html: html,
      customClass: 'credit-limit-area',
      width: '43.2rem',
      padding: 16,
      animation: false,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#D8D8D8',
      cancelButtonClass: 'pointer',
      showConfirmButton: false,
      buttonsStyling: false,
      allowOutsideClick: false,
      preConfirm: () => {
        const input: any = document.getElementById('creditSlider');
        return Promise.resolve(input.value);
      },
      onOpen: (modalElement: any) => {
        const input: any = document.getElementById('creditSlider');

        const scaleNum: number = 21; // 1000円単位の場合は、20個の目盛を出す。
        const scaleArea: any = document.getElementById('scale-area');

        for (let i = 0; i < scaleNum; i++) {
          const divElement: any = document.createElement('div');
          switch (i) {
            case 0:
              divElement.setAttribute('class', 'side');
              divElement.setAttribute('style', 'left:0.2rem');
              break;
            case scaleNum - 1:
              divElement.setAttribute('class', 'side');
              divElement.setAttribute('style', 'left:39.8rem');
              break;
            default:
              const left: any = (400 / (scaleNum - 1) * i) / 10;
              divElement.setAttribute('style', 'left:' + left + 'rem');
              break;
          }
          scaleArea.appendChild(divElement);
        }
      }
    });
  }

  public static showCreditLimitForNotChange(initialLimit: number, maxBudget: number): void {
    const creditLimitMsg: string = text[store.state.common.language].dialogTexts.CREDIT_CARD_LIMIT;
    const contactUsMsg: string = text[store.state.common.language].dialogTexts.PLEASE_CONTACT_US;
    const inquiryFormMsg: string = text[store.state.common.language].dialogTexts.THE_INQUIRY_FORM;
    const changeLimitMsg: string = text[store.state.common.language].dialogTexts.IF_YOU_WANT_TO_CHANGE_LIMIT;
    const isJapanese: boolean = store.state.common.language === 'ja' ? true : false;
    let html: string = `<div class="credit-limit">
      <p class="popup-title">${creditLimitMsg}</p>
      <div id="credit-limit-value-area">
        <div id="credit-limit-value">&yen; ${initialLimit.toLocaleString()}</div>
      </div>
      <div id="credit-slider-area">
        <datalist id="datalists"></datalist>
        <div id="bar-base"></div>
      </div>
      <div id="scale-area"></div>`;

    if (!isJapanese) {
      html += `<div class="credit-limit-msg no-change">
      ${contactUsMsg} <a href="https://support.sonynetwork.co.jp/IoT/web/form113.html" target="_blank"> ${inquiryFormMsg} </a> ${changeLimitMsg}
      </div>
      </div>`;
    } else if (isJapanese) {
      html += `<div class="credit-limit-msg no-change">
      ${changeLimitMsg} <a href="https://support.sonynetwork.co.jp/IoT/web/form113.html" target="_blank"> ${inquiryFormMsg} </a> ${contactUsMsg}
      </div>
      </div>`;
    }

    swal({
      html: html,
      customClass: 'credit-limit-area',
      width: '43.2rem',
      padding: 16,
      animation: false,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#D8D8D8',
      cancelButtonClass: 'pointer',
      showConfirmButton: false,
      buttonsStyling: false,
      allowOutsideClick: false,
      preConfirm: () => {
        const input: any = document.getElementById('creditSlider');
        return Promise.resolve(input.value);
      },
      onOpen: (modalElement: any) => {
        const input: any = document.getElementById('creditSlider');

        const scaleNum: number = 21; // 1000円単位の場合は、20個の目盛を出す。
        const scaleArea: any = document.getElementById('scale-area');

        for (let i = 0; i < scaleNum; i++) {
          const divElement: any = document.createElement('div');
          switch (i) {
            case 0:
              divElement.setAttribute('class', 'side');
              divElement.setAttribute('style', 'left:0.2rem');
              break;
            case scaleNum - 1:
              divElement.setAttribute('class', 'side');
              divElement.setAttribute('style', 'left:39.8rem');
              break;
            default:
              const left: any = (400 / (scaleNum - 1) * i) / 10;
              divElement.setAttribute('style', 'left:' + left + 'rem');
              break;
          }
          scaleArea.appendChild(divElement);
        }
      }
    }).then(() => {
      // do nothing
    }, () => {
      // do nothing
    });
  }

  public static setWorkspaceLimit(currentValue: number, usedValue: number, maxWorkspace: number, lowerLimit: number, upperLimit: number, scaleMin: number, scaleMax: number, step: number, numberOfScale: number, callback?: (workspaceLimit: number) => void): void {
    const unitString: string = 'GB';
    const workSpaceLimitMsg: string = text[store.state.common.language].dialogTexts.WORKSPACE_LIMIT;
    const usedMsg: string = text[store.state.common.language].dialogTexts.USED;
    const weWillChargeTheAmountMsg: string = text[store.state.common.language].dialogTexts.WE_WILL_CHARGE_AMOUNT_OF_LARGEST;
    const confirmMessage: string = text[store.state.common.language].dialogTexts.ARE_YOU_SURE_BILLING_AMOUNT;
    let isErrorMessage: boolean = false;
    const callbackFunc: (workspaceLimit?: any) => void = callback && typeof callback === 'function' ? callback : () => {
      return;
    };
    const html: string = `<div class="credit-limit">
      <p class="popup-title">${workSpaceLimitMsg}</p>
      <div class="popup-used-value hidden-target-element">${usedValue}${unitString} ${usedMsg}</div>
      <div id="credit-limit-value-area">
        <div class="hidden-target-element"><img id="credit-limit-minus-icon" class="slider-change-icon" src="/console/image/Minus.svg"></div>
        <div id="credit-limit-value">${currentValue.toLocaleString()}${unitString}</div>
        <div class="hidden-target-element"><img id="credit-limit-plus-icon" class="slider-change-icon" src="/console/image/AddNewBlue.svg"></div>
      </div>
      <div id="credit-slider-area" class="hidden-target-element">
        <input id="creditSlider" type="range" value="${currentValue}" min="${scaleMin}" max="${scaleMax}"
        step="${step}" list="datalists" class="range">
        <datalist id="datalists"></datalist>
        <div id="bar-base"></div>
        <div id="bar-active"></div>
        <div id="bar-non-active"></div>
      </div>
      <div id="scale-area" class="hidden-target-element"></div>
      <div class="scale-box hidden-target-element">
        <div>${scaleMin}</div>
        <div>${scaleMax}</div>
      </div>
      <div id="workspace-limit-msg" class="credit-limit-msg">
        ${weWillChargeTheAmountMsg}
      </div>
    </div>`;

    swal({
      html: html,
      customClass: 'credit-limit-area',
      width: '43.2rem',
      padding: 16,
      animation: false,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      cancelButtonColor: '#D8D8D8',
      cancelButtonClass: 'pointer',
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer',
      focusCancel: true,
      reverseButtons: true,
      buttonsStyling: false,
      allowOutsideClick: false,
      preConfirm: () => {
        const input: any = document.getElementById('creditSlider');
        const value: any = input.value;
        if (maxWorkspace < Number(value) && !isErrorMessage) {
          isErrorMessage = true;
          const hiddenTargetElements: any = document.getElementsByClassName('hidden-target-element');
          for (let i = 0; i < hiddenTargetElements.length; i++) {
            hiddenTargetElements[i].style.visibility = 'hidden';
          }
          const workspaceMessage: HTMLElement | null = document.getElementById('workspace-limit-msg');
          if (workspaceMessage) {
            workspaceMessage.textContent = confirmMessage;
          }
          const confirmButton: any = document.getElementsByClassName('swal2-confirm');
          if (confirmButton.length) {
            confirmButton[0].style.background = 'rgb(255, 102, 102)';
          }
          return Promise.reject('');
        } else {
          return Promise.resolve(value);
        }
      },
      onOpen: (modalElement: any) => {
        const input: any = document.getElementById('creditSlider');
        const minusIcon: any = document.getElementById('credit-limit-minus-icon');
        const plusIcon: any = document.getElementById('credit-limit-plus-icon');

        const updateRange = (value: number) => {
          const activeWidth: number = 400 * ((value - scaleMin) / (scaleMax - scaleMin));
          const activeBar: any = document.getElementById('bar-active');
          activeBar.style.width = String(activeWidth / 10) + 'rem';

          const nonActiveWidth: number = 400 * ((lowerLimit - scaleMin) / (scaleMax - scaleMin));
          const nonActiveBar: any = document.getElementById('bar-non-active');
          nonActiveBar.style.width = String(nonActiveWidth / 10) + 'rem';

          const minusAfterValue: number = value - step;
          if (minusAfterValue < lowerLimit || minusAfterValue < scaleMin) {
            // TODO 画像はあとで正しいものに変更
            minusIcon.src = '/console/image/Minus.svg';
            minusIcon.style.cursor = 'auto';
            minusIcon.style.opacity = 0.25;
          } else {
            minusIcon.src = '/console/image/MinusBlue.svg';
            minusIcon.style.cursor = 'pointer';
            minusIcon.style.opacity = 1;
          }

          const plusAfterValue: number = value + step;
          if (plusAfterValue > upperLimit || scaleMax < plusAfterValue) {
            // TODO 画像はあとで正しいものに変更
            plusIcon.src = '/console/image/AddNew.svg';
            plusIcon.style.cursor = 'auto';
            plusIcon.style.opacity = 0.25;
          } else {
            plusIcon.src = '/console/image/AddNewBlue.svg';
            plusIcon.style.cursor = 'pointer';
            plusIcon.style.opacity = 1;
          }

        };

        const updateValue = (value: number) => {
          const valueElement: any = document.getElementById('credit-limit-value');
          valueElement.innerHTML = value.toLocaleString() + unitString;
        };

        input.oninput = (e: any) => {
          if (Number(e.target.value) < lowerLimit) {
            const slider: any = document.getElementById('creditSlider');
            slider.value = lowerLimit;
            updateValue(lowerLimit);
            updateRange(lowerLimit);
          } else if (Number(e.target.value) > upperLimit) {
            const slider: any = document.getElementById('creditSlider');
            slider.value = upperLimit;
            updateValue(upperLimit);
            updateRange(upperLimit);
          } else {
            updateValue(Number(e.target.value));
            updateRange(Number(e.target.value));
          }
        };

        minusIcon.onclick = (e: any) => {
          const slider: any = document.getElementById('creditSlider');
          const value: number = Number(slider.value);
          const afterValue: number = (value - step) < scaleMin ? scaleMin : value - step;
          if (afterValue < lowerLimit || afterValue < scaleMin) {
            return;
          }
          slider.value = afterValue;
          updateValue(afterValue);
          updateRange(afterValue);

        };

        plusIcon.onclick = (e: any) => {
          const slider: any = document.getElementById('creditSlider');
          const value: number = Number(slider.value);
          const afterValue: number = (value + step) > scaleMax ? scaleMax : value + step;
          if (afterValue > upperLimit || afterValue > scaleMax) {
            return;
          }
          slider.value = afterValue;
          updateValue(afterValue);
          updateRange(afterValue);
        };

        const datalist: any = document.getElementById('datalists');
        for (let i = scaleMin; i <= scaleMax; i += step) {
          const optionElement = document.createElement('option');
          optionElement.innerHTML = String(i);
          datalist.appendChild(optionElement);
        }

        const scaleArea: any = document.getElementById('scale-area');

        for (let i = 0; i < numberOfScale; i++) {
          const divElement: any = document.createElement('div');
          switch (i) {
            case 0:
              divElement.setAttribute('class', 'side');
              divElement.setAttribute('style', 'left:0.2rem');
              break;
            case numberOfScale - 1:
              divElement.setAttribute('class', 'side');
              divElement.setAttribute('style', 'left:39.8rem');
              break;
            default:
              const left: any = (400 / (numberOfScale - 1) * i) / 10;
              divElement.setAttribute('style', 'left:' + left + 'rem');
              break;
          }
          scaleArea.appendChild(divElement);
        }

        updateRange(currentValue);
      }
    }).then((workspaceLimit) => {
      if (callback && typeof callback === 'function') {
        callback(workspaceLimit);
      }
    }, () => {
      callbackFunc();
    });
  }

  public static showSupport(tenantId: string): void {
    const ifTheLinkDoesNotOpen: string = text[store.state.common.language].dialogTexts.IF_THE_LINK_DOES_NOT_AUTOMATICALLY_OPEN;
    const message: string = text[store.state.common.language].dialogTexts.IF_YOU_HAVE_QUESTIONS;
    const body: string = text[store.state.common.language].dialogTexts.BODY;
    const plaseWriteMsg: string = text[store.state.common.language].dialogTexts.PLEASE_WRITE_DETAIL;
    const subject: string = text[store.state.common.language].dialogTexts.SUBJECT;
    const mailAddress: string = 'snc-nnc-tech-support@sony.com';

    const html: string = `
      <div class="support-dialog">
        <div class="message">${message}</div>
        <div class="mail-address-area">
          <a id="mail-address" class="pointer">${mailAddress}</a>
        </div>
        <div>
          <div class="supplementation">
            ${ifTheLinkDoesNotOpen}
          </div>
          <div class="subject">
            ${subject} Inquiry to NNC Technical Support
          </div>
          <div class="body">
            ${body}: [ID: ${tenantId}]
            <div>${plaseWriteMsg}</div>
          </div>
        </div>
      </div>
    `;

    swal({
      customClass: 'swal-support',
      width: '43.2rem',
      padding: 16,
      animation: false,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer',
      buttonsStyling: false,
      html: html,
      onBeforeOpen: () => {
        const mailAddressLink: HTMLSelectElement | null = document.getElementById('mail-address') as HTMLSelectElement;
        if (mailAddressLink) {
          mailAddressLink.onclick = () => {
            const newLine: string = '%0d%0a';
            const mailBody: string = `[ID: ${tenantId}]${newLine}${plaseWriteMsg}`;
            location.href = `mailto:${mailAddress}?subject=Inquiry to NNC Technical Support&body=${mailBody}`;
          };
        }
      }
    }).then((response: any) => {
      // do nothing.
    }, () => {
      // do nothing.
    });
  }

  public static showUsedInstanceDetails(details: IUsedInstanceDetail[]): void {
    function createBody(): string {
      let body: string = '';
      details.forEach((detail: IUsedInstanceDetail) => {
        body += `
          <tr>
            <td>${detail.processor}</td>
            <td>${detail.time}</td>
            <td class="amount">&yen; ${detail.amount}</td>
          </tr>
        `;
      });
      return body;
    }
    const language: string = store.state.common.language;
    const jobDetailMsg: string = text[language].dialogTexts.JOB_DETAILS;
    const vueTexts: {[key: string]: string} = text[language].vueTexts.tenantMembers;
    const html: string = `<div class="credit-limit">
      <p class="popup-title">${jobDetailMsg}</p>
      <div>
        <table>
          <thead>
            <th>${vueTexts.PROCESSOR}</th>
            <th>${vueTexts.TIME}</th>
            <th class="amount">${vueTexts.AMOUNT}</th>
          </thead>
          <tbody>
            ${createBody()}
          </tbody>
        </table>
      </div>
    </div>`;

    swal({
      html: html,
      customClass: 'used-instance-details',
      width: '43.2rem',
      padding: 16,
      animation: false,
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#006699',
      confirmButtonClass: 'pointer',
      reverseButtons: true,
      buttonsStyling: false
    }).then(() => {
      // do nothing
    }, () => {
      // do nothing.
    });
  }

}
