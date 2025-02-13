(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function editPositionPriceList(event) {
  debugger;
  const target = event.target;
  const tr = target.closest("tr");
  const editItem = tr.querySelectorAll("._edit");
  const arrData = Array.from(editItem).map((item) => {
    return item.innerText;
  });
  const modal = document.querySelector("#modal-edit-position");
  modal.dataset.modalId = tr.id;
  const itemEdit = modal.querySelectorAll(".block-item > div");
  itemEdit.forEach((element, indx) => {
    const input = element.querySelector("._edit-input");
    if (input.tagName === "SELECT" && indx === 0) {
      $("[name='Категория']").val(arrData[indx]).trigger("change");
    } else if (input.tagName === "SELECT" && indx === 2) {
      $("[name='Единица измерения']").val(arrData[indx]).trigger("change");
    } else {
      input.classList.remove("_error");
      input.value = arrData[indx];
    }
  });
}
const obgСategoryClass = {
  Мат: "_mat-category",
  Раб: "_rab-category",
  Мех: "_meh-category",
  Док: "_doc-category"
};
function saveEditPositionPriceList(event) {
  const target = event.target;
  const modalId = target.closest("[data-modal-id]").dataset.modalId;
  const modal = target.closest("[data-modal-id]");
  const itemPriceList = document.querySelectorAll(".price-list tbody tr");
  const itemEdit = modal.querySelectorAll("._edit-input");
  const arrData = collectInputData(itemEdit);
  let isValidate = validateEmpty(itemEdit);
  if (isValidate) {
    itemPriceList.forEach((item) => {
      if (item.id === modalId) {
        item.querySelectorAll("._edit").forEach((item2, indx) => {
          if (indx === 0) {
            item2.innerHTML = `<span class='${obgСategoryClass[arrData[indx]]}'>${arrData[indx]}</span>`;
          } else {
            item2.innerText = arrData[indx];
          }
        });
      }
    });
    $("#modal-edit-position").modal("hide");
  }
}
/*! валидация в модальном окне на пустой инпут */
function validateEmpty(list) {
  let isValidate = false;
  list.forEach((element) => {
    if (!element.value && element.matches("._validate")) {
      element.classList.add("_error");
    } else {
      element.classList.remove("_error");
    }
  });
  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    if (!element.value && element.matches("._validate")) {
      isValidate = false;
      break;
    }
    isValidate = true;
  }
  return isValidate;
}
function collectInputData(list) {
  return Array.from(list).map((element) => {
    return element.value;
  });
}
function getCurrentDataClient() {
  const currentClientData = document.querySelectorAll(
    ".block-item__item .block-item__contetn"
  );
  const modal = document.querySelector("#modal-client");
  const editClientInput = modal.querySelectorAll("._edit-input");
  editClientInput.forEach((element) => {
    element.classList.remove("_error");
  });
  const collectClient = Array.from(currentClientData).map((el) => {
    if (el.querySelector(".block-item__list")) {
      return el.innerText.split("\n");
    }
    return el.innerText;
  });
  editClientInput.forEach((element, indx) => {
    if (element.matches(".select2")) {
      const nameSelect = element.name;
      $(`[name='${nameSelect}']`).val(collectClient[indx]).trigger("change");
    } else {
      element.value = collectClient[indx];
    }
  });
}
function saveEditClient() {
  const modal = document.querySelector("#modal-client");
  const editClientData = modal.querySelectorAll("._edit-input");
  const currentClientData = document.querySelectorAll(
    "#static .block-item__item .block-item__contetn"
  );
  const collectClient = Array.from(editClientData).map((el) => {
    if (el.matches(".select2")) {
      const nameSelect = el.name;
      return $(`[name='${nameSelect}']`).val();
    }
    return el.value;
  });
  let isValidate = validateEmpty(editClientData);
  if (isValidate) {
    currentClientData.forEach((element, indx) => {
      if (element.querySelector(".block-item__list")) {
        element.querySelector(".block-item__list").remove();
        сreatingList(element, collectClient[indx]);
      } else {
        element.innerText = collectClient[indx];
      }
    });
    $("#modal-client").modal("hide");
  }
}
function сreatingList(element, data) {
  const ul = document.createElement("ul");
  ul.classList.add("block-item__list");
  data.forEach((element2) => {
    const li = document.createElement("li");
    li.innerText = element2;
    ul.append(li);
  });
  element.append(ul);
}
function creatingSmeta() {
  const listSmeta = document.querySelector("[data-smeta]");
  if (listSmeta) {
    listSmeta.insertAdjacentHTML(
      "beforeend",
      `  <li class="list-smeta__item   d-flex" data-smeta-item>
  <div class="list-smeta__wrapper">
    <div class="list-smeta__contetn">
      <span class="handle  _icon-darag">
      </span>
      <div class="list-smeta__accordion accordion  card ">
        <div class="text-left  accordion__header collapsed middle-title">
          <button type="button" class="accordion__btn" data-animation-speed="0" data-card-widget="collapse"></button>
          <label class="accordion__checkbox checkbox">
            <input hidden data-chkc-smeta type="checkbox" class="checkbox__input" name="checkbox-smeta" onchange="toggleBulkActionBar()">
          </label>
          <div class="accordion__header-content">
            <div class="accordion__name" onclick='editTextInput(event)' data-name='Наименование сметы'><input type="text" data-edit-input onblur="saveTextInput(event)"  class="input-default"></div>
            <div class="accordion__select ">
                <label class="accordion__name-select">Печать</label>
              <div class="select-stamp">
                <select class="select2 select2-stamp  select2-hidden-accessible" name="Печать" style="width: 100%;"
                  data-select2-id="select-status-" tabindex="-1" aria-hidden="true">
                  <option value="Без печати" class="select-status__completed" selected >Без печати</option>
                  <option  value="С печатью" class="select-status__in-progress">С печатью</option>
                
                </select>
              </div>
            </div>
            <div class="accordion__del-btn" >
                  <button type="button" onclick="deleteItem(event,'data-smeta-item')"  class="btn-del-big"><span>Удалить</span></button>
            </div>
          </div>
        </div>



        <div class="accordion__body card-body">
          <!-- Этапы работы -->
          <ul class="list-smeta   mt-3" data-stages >

          </ul>
  
          <!-- Конец Этапы работы -->
        </div>


      </div>
    </div>
    <div class="list-smeta__footer footer-list">
      <button type="button" class="butt-plus" onclick="creatingStages(event)" data-create-stage><span>Этап
          работ</span></button>
      <span class="footer-list__sum">Итого по смете: <span data-sum data-name='Итого по смете'>0</span> р.</span>
    </div>
    <div class="mt-3">
      <label class="very-small-title"> Комментарий</label>
    	<textarea ame="комментарий" id="" class="textarea-default"></textarea>
    </div>

  </div>
</li>`
    );
    initSortable(".list-smeta");
  }
  $(".select2-stamp").select2({
    minimumResultsForSearch: Infinity,
    placeholder: "",
    dropdownCssClass: "select-stamp__drop-down",
    allowClear: true,
    width: "resolve",
    language: {
      noResults: function() {
        return "Ничего не найдено";
      }
    }
  });
  initHandelKeyDown();
}
initSortable(".list-smeta");
function initSortable(selector) {
  if (document.querySelector(selector)) {
    $(selector).sortable({
      tolerance: "pointer",
      // Улучшает точность Drag & Drop
      placeholder: "position-highlight",
      handle: ".handle",
      revert: 100,
      connectWith: "[data-stage-item]",
      forcePlaceholderSize: true,
      start: function(event, ui) {
        ui.placeholder.height(ui.item.height());
      },
      // Плавная анимация возврата
      start: function(event, ui) {
      },
      stop: function(event, ui) {
      }
    });
  }
}
function creatingStages(event) {
  const smeta = event.target.closest("[data-smeta-item]");
  const listStage = smeta.querySelector("[data-stages]");
  listStage.insertAdjacentHTML(
    "beforeend",
    `    <li class="list-smeta__item  " data-stage-item>
                      <div class="list-smeta__contetn">
                        <span class="handle  _icon-darag">
                        </span>
                        <div class="list-smeta__accordion accordion card ">
                          <!-- Начала Позиций  -->

                          <div class=" text-left accordion__header middle-title">
                            <button type="button" class="accordion__btn" data-animation-speed="0" data-card-widget="collapse"></button>

                            <div class="accordion__header-content">
                              <div class="accordion__name very-small-title accordion__name_small-text" onclick='editTextInput(event)' data-name='Наименование этапа'><input  type="text" data-edit-input onblur="saveTextInput(event)"  class="input-default"></div>
                              <div class="accordion__del-btn accordion__del-btn_small"><button onclick="deleteItem(event,'data-stage-item')" type="button" 
                                  class=" btn-del-small"></button></div>
                            </div>
                          </div>
                          <div class="accordion__body card-body ">
                            <ul class=" accordion__list list-position">
                              <li class=" list-position__head">
                                <div></div>
                                <div><label class="checkbox">
                                    	<input hidden="" onchange="chooseAllCheckbox(event)"
																			type="checkbox" class="checkbox__input">
                                  </label></div>
                                <div>№</div>
                                <div>Арт.</div>
                                <div>Наименование работ</div>
                                <div>Ед.
                                  изм.</div><span>Кол-во.</span><span>Цена р.</span>
                                <div>Сумма р.</div>
                                <div></div>
                              </li>
                              <li class="list-position__body">
                                <ul class="list-position" data-position >
                                  
                                </ul>
                              </li>
                              <li class="list-position__footer footer-list">
                                <button type="button" class="butt-plus" onclick="creatingPosition(event)"
                                  data-create-position><span>Позиция</span></button>
                                <span class="footer-list__sum">Итого:<span
																		data-sum data-name='Итого по этапа'>0</span> р.</span>
                              </li>
                            </ul>
                          </div>
                          <!-- Конец Позиций -->
                        </div>
                      </div>
                    </li>
      `
  );
  $(".list-position").sortable({
    tolerance: "pointer",
    // Улучшает точность Drag & Drop
    placeholder: "position-highlight",
    handle: ".handle",
    revert: 100,
    connectWith: "[data-stage-item]",
    forcePlaceholderSize: true,
    start: function(event2, ui) {
      ui.placeholder.height(ui.item.height());
    },
    stop: function(event2, ui) {
      let target = event2.target;
      if (target.matches("[data-position]")) {
        createIterationNumber(target);
      }
    }
  });
  initHandelKeyDown();
}
function creatingPosition(event) {
  const stage = event.target.closest("[data-stage-item]");
  const listPosition = stage.querySelector("[data-position]");
  let numerItem = findMaxNumber(listPosition);
  let id = generateRandomId();
  listPosition.insertAdjacentHTML(
    "beforeend",
    `<li class="list-position__item" data-position-item>
    <div class="handle _icon-darag"></div>
    <div><label class="checkbox">
        <input  hidden data-chkc-position type="checkbox" class="checkbox__input" name="checkbox-smeta" onchange="toggleBulkActionBar()">
      </label></div>
    <div onclick='editTextInput(event)' data-name='№'>${numerItem}</div>
    <div></div>
    <div data-name='Наименование работ' class="list-position__name" onclick='editTextInput(event)' data-search-items>
    <input type="text"  onblur="saveTextInput(event)"   onkeyup="showDropDown(event)"  data-edit-input  class="input-default">
      <ul class="list-position__search search-position">
      <li onclick="saveTextSearchList(event)">Скважины</li>
      <li onclick="saveTextSearchList(event)">Септики</li>
      <li onclick="saveTextSearchList(event)">Баратеон</li>
      <li onclick="saveTextSearchList(event)">Николаев</li>
      <li onclick="saveTextSearchList(event)">Единица</li>
			<li onclick="saveTextSearchList(event)">Скважины</li>
			<li onclick="saveTextSearchList(event)">Септики</li>
			<li onclick="saveTextSearchList(event)">Баратеон</li>
			<li onclick="saveTextSearchList(event)">Николаев</li>
			<li onclick="saveTextSearchList(event)">Единица</li>
    	</ul>
    </div>
    <div onclick='editTextSelect(event)' data-name='Ед. изм.'>
                <select onblur="saveTextInput(event)" class="select2 select2-unit  _edit-input" data-select='${id}' name="Единица измерения">
                <option value="-">-</option>
                  <option value="сотка">сотка</option>
                  <option value="м²">м²</option>
                  <option value="м³">м³</option>
                  <option value="м.">м.</option>
                  <option value="усл.">усл.</option>
                  <option value="ед.">ед.</option>
                  <option value="п.м.">п.м.</option>
                  <option value="шт.">шт.</option>
                </select>
                </div>
    <div onclick='editTextInput(event)'data-qty-position data-name='Кол-во.'><input data-number   type="text" data-edit-input onblur="saveTextInput(event)"  class="input-default"></div>
    <div onclick='editTextInput(event)' data-price-position data-name='Цена р.'><input data-number   type="text" data-edit-input onblur="saveTextInput(event)"  class="input-default"></div>
    <div data-sum-position data-name='Сумма р.'>0</div>
    <div><button type="button" class="btn-del-small" onclick="deleteItem(event,'data-position-item')" ></button></div>
  </li>`
  );
  inintSelect2(id);
  initHandelKeyDown();
}
function deleteSelectedItems() {
  const checkboxes = document.querySelectorAll('input[name="checkbox-smeta"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const dataCheck = checkbox.dataset;
      if (Object.keys(dataCheck)[0] === "chkcSmeta") {
        checkbox.closest("[data-smeta-item]").remove();
      }
      if (Object.keys(dataCheck)[0] === "chkcPosition") {
        selectSubtractPosition(checkbox.closest("[data-position-item]"));
        const listPosition = checkbox.closest("[data-position]");
        createIterationNumber(
          listPosition,
          () => checkbox.closest("[data-position-item]").remove()
        );
      }
    }
  });
  toggleBulkActionBar();
}
function selectSubtractPosition(positionItem) {
  const dataPositionItem = positionItem;
  const stageSum = positionItem.closest("[data-stage-item]").querySelector("[data-sum]");
  const smetaSum = positionItem.closest("[data-smeta-item]").querySelector(".list-smeta__wrapper > .footer-list  [data-sum]");
  stageSum.innerText = formatterIntl(
    Number(stageSum.innerText.replace(/\s+/g, "")) - Number(
      dataPositionItem.querySelector("[data-sum-position]").innerText.replace(/\s+/g, "")
    )
  );
  smetaSum.innerText = formatterIntl(
    Number(smetaSum.innerText.replace(/\s+/g, "")) - Number(
      dataPositionItem.querySelector("[data-sum-position]").innerText.replace(/\s+/g, "")
    )
  );
}
function deleteItem(event, dataSelector) {
  if (dataSelector === "data-smeta-item") {
    event.currentTarget.closest(`[${dataSelector}]`).remove();
  }
  if (dataSelector === "data-stage-item") {
    event.currentTarget.closest(`[${dataSelector}]`).remove();
    subtractStageSum(event.currentTarget.closest(`[${dataSelector}]`));
  }
  if (dataSelector === "data-position-item") {
    subtractPositionSum(event.currentTarget.closest(`[${dataSelector}]`));
    createIterationNumber(
      event.currentTarget.closest(`[data-position]`),
      () => event.currentTarget.closest(`[${dataSelector}]`).remove()
    );
  }
  toggleBulkActionBar();
}
function subtractPositionSum(selector) {
  const sumPosition = selector.querySelector("[data-sum-position]");
  const parentStage = selector.closest("[data-stage-item]");
  const sumStage2 = parentStage.querySelector(".footer-list  [data-sum]");
  subtractSmetaSum(selector, sumPosition.innerText);
  sumStage2.innerText = formatterIntl(
    Number(sumStage2.innerText.replace(/\s+/g, "")) - Number(sumPosition.innerText.replace(/\s+/g, ""))
  );
}
function subtractSmetaSum(selector, currentSum) {
  const smetaItem = selector.closest("[data-smeta-item]");
  const sumSmeta2 = smetaItem.querySelector(
    ".list-smeta__wrapper > .footer-list  [data-sum]"
  );
  let sum = Number(sumSmeta2.innerText.replace(/\s+/g, ""));
  sum = sum - Number(currentSum.replace(/\s+/g, ""));
  sumSmeta2.innerText = formatterIntl(sum);
}
function subtractStageSum(selector) {
  const smetaItem = selector.closest("[data-smeta-item]");
  const sumStages = selector.querySelectorAll("[data-sum]");
  const sumSmeta2 = smetaItem.querySelector(
    ".list-smeta__wrapper > .footer-list  [data-sum]"
  );
  const listSumStage = Array.from(sumStages).map((el) => {
    return Number(el.innerText.replace(/\s+/g, ""));
  });
  let sum = Number(sumSmeta2.innerText.replace(/\s+/g, ""));
  listSumStage.forEach((el) => {
    sum -= el;
  });
  sumSmeta2.innerText = formatterIntl(sum);
}
function saveTextInput(event) {
  setTimeout(() => {
    let target = event.target;
    let value = target.value;
    const parent = target.parentElement;
    if (target.closest("[data-search-items]") && value) {
      parent.innerText = String(Number(value)) === value ? formatterIntl(value) : value;
      createingHiddentInput(value, parent);
      return;
    }
    if (value) {
      parent.innerText = String(Number(value)) === value ? formatterIntl(value) : value;
      createingHiddentInput(value, parent);
    }
  }, 100);
}
function editTextInput(event) {
  let target = event.currentTarget;
  if (target.querySelector("[data-edit-input]")) {
    sumItemPosition(target);
    return;
  }
  createInputEdit(target);
  sumItemPosition(target);
}
function createInputEdit(parent) {
  const parentText = parent.innerText;
  parent.innerText = "";
  const IsNumber = parent.matches("[data-qty-position]") || parent.matches("[data-price-position]");
  if (parent.matches(".list-position__name")) {
    parent.insertAdjacentHTML(
      "beforeend",
      `<input type="text" onblur="saveTextInput(event)"   onkeyup="showDropDown(event)"  data-edit-input value="${parentText}"  class="input-default">
      <ul class="list-position__search search-position">
      <li onclick="saveTextSearchList(event)">Скважины</li>
      <li onclick="saveTextSearchList(event)">Септики</li>
      <li onclick="saveTextSearchList(event)">Баратеон</li>
      <li onclick="saveTextSearchList(event)">Николаев</li>
      <li onclick="saveTextSearchList(event)">Единица</li>
			<li onclick="saveTextSearchList(event)">Скважины</li>
			<li onclick="saveTextSearchList(event)">Септики</li>
			<li onclick="saveTextSearchList(event)">Баратеон</li>
			<li onclick="saveTextSearchList(event)">Николаев</li>
			<li onclick="saveTextSearchList(event)">Единица</li>
    	</ul>`
    );
  } else {
    parent.insertAdjacentHTML(
      "beforeend",
      `<input type="text" onblur="saveTextInput(event)" ${IsNumber ? "data-number" : ""}   data-edit-input value="${parentText}"  class="input-default">`
    );
  }
  if (parent.querySelector("[data-edit-input]")) {
    parent.querySelector("[data-edit-input]").focus();
  }
  initHandelKeyDown();
}
function toggleBulkActionBar() {
  const checkboxs = document.querySelectorAll('[name="checkbox-smeta"]');
  const tooltipSmeta = document.querySelector(".bulkActionBar");
  const selectedCount = document.querySelector("[data-selected-count]");
  let count = 0;
  let isChecked = false;
  checkboxs.forEach((checkbox) => {
    if (checkbox.checked) {
      ++count;
    }
    if (!isChecked) {
      isChecked = checkbox.checked;
    }
  });
  selectedCount.innerText = count;
  if (isChecked) {
    tooltipSmeta.classList.add("_show-tooltipSmeta");
    document.querySelector(".content-wrapper").classList.add("bulkActionBar-bottom");
  } else {
    tooltipSmeta.classList.remove("_show-tooltipSmeta");
    document.querySelector(".content-wrapper").classList.remove("bulkActionBar-bottom");
  }
}
function initHandelKeyDown() {
  const inputs = document.querySelectorAll("[data-edit-input]");
  inputs.forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        saveTextInput(e);
      }
    });
  });
}
function findMaxNumber(parentSmeta) {
  const li = parentSmeta.querySelectorAll(`[data-position]  > li`);
  let max = 0;
  if (li.length === 0) {
    return 1;
  }
  li.forEach((element) => {
    if (max <= Number(element.children[2].innerText)) {
      max = Number(element.children[2].innerText) + 1;
    }
  });
  return max;
}
function createIterationNumber(selector, callBackDelet = "") {
  const parentPosition = selector.closest("[data-position]");
  if (callBackDelet) {
    callBackDelet();
  }
  const list = parentPosition.querySelectorAll("[data-position-item]");
  let numberItem = 0;
  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    element.children[2].innerText = ++numberItem;
  }
}
function sumItemPosition(selectorDiv) {
  const positionLi = selectorDiv.parentElement;
  const stageLi = selectorDiv.parentElement.closest(".list-smeta__item");
  const qty = positionLi.querySelector("[data-qty-position] input");
  const price = positionLi.querySelector("[data-price-position] input");
  const sum = positionLi.querySelector("[data-sum-position]");
  const input = selectorDiv.querySelector("input[data-edit-input]");
  if (input && typeof input.dataset.number !== "undefined") {
    input.addEventListener("blur", (e) => {
      if (qty.value === "" || price.value === "") {
        sum.innerText = 0;
        sumStage(stageLi);
        return;
      }
      if (qty.value && price.value) {
        sum.innerText = formatterIntl(
          (Number(qty.value.replace(/\s+/g, "")) * Number(price.value.replace(/\s+/g, ""))).toFixed(2)
        );
        createingHiddentInput(sum.innerText, sum);
        sumStage(stageLi);
      }
    });
    input.addEventListener("input", (e) => {
      input.value = input.value.replace(/[^0-9.]/g, "");
    });
  }
}
function formatterIntl(number) {
  const formatted = new Intl.NumberFormat("ru").format(number);
  return formatted.replace(",", ".");
}
function sumStage(stageLi) {
  const selectorSumStage = stageLi.querySelector("[data-sum]");
  let sum = 0;
  const sumlistPosition = stageLi.querySelectorAll(
    `[data-position] > li [data-sum-position]`
  );
  sumlistPosition.forEach((element) => {
    sum = sum + Number(element.innerText.replace(/\s+/g, ""));
  });
  selectorSumStage.innerText = formatterIntl(sum);
  createingHiddentInput(sum, selectorSumStage);
  sumSmeta(stageLi);
}
function sumSmeta(stageLi) {
  const listSelectorSmeta = stageLi.closest("[data-smeta]");
  const selectorLiSmeta = listSelectorSmeta.querySelectorAll("[data-smeta] > li");
  selectorLiSmeta.forEach((smeta) => {
    const sumStage2 = smeta.querySelectorAll("[data-stages] > li [data-sum]");
    let sum = 0;
    sumStage2.forEach((element) => {
      sum += Number(element.innerText.replace(/\s+/g, ""));
    });
    smeta.querySelector(".list-smeta__footer [data-sum]").innerText = formatterIntl(sum);
    createingHiddentInput(
      sum,
      smeta.querySelector(".list-smeta__footer [data-sum]")
    );
  });
}
function chooseAllCheckbox(event) {
  const target = event.target;
  const isChecked = event.currentTarget.checked;
  const stageItem = target.closest(".list-position");
  const checkboxs = stageItem.querySelectorAll("[data-chkc-position]");
  checkboxs.forEach((element) => {
    element.checked = isChecked;
  });
  toggleBulkActionBar();
}
function editTextSelect(event) {
  let target = event.currentTarget;
  if (target.querySelector("[data-select]")) {
    return;
  }
  createSelectEdit(target);
}
function createSelectEdit(parent) {
  const parentText = parent.innerText;
  parent.innerText = "";
  const id = generateRandomId();
  parent.insertAdjacentHTML(
    "beforeend",
    `<select onblur="saveTextInput(event)" value='сотка'  class="  select2 select2-unit  _edit-input" data-select='${id}' name="Единица измерения">
                <option value="-">-</option>
                  <option value="сотка">сотка</option>
                  <option value="м²">м²</option>
                  <option value="м³">м³</option>
                  <option value="м.">м.</option>
                  <option value="усл.">усл.</option>
                  <option value="ед.">ед.</option>
                  <option value="п.м.">п.м.</option>
                  <option value="шт.">шт.</option>
                </select>`
  );
  inintSelect2(id);
  changeSelected(parent.children[0].name);
  $(`[data-select='${id}']`).val(parentText).trigger("change");
  $(`[data-select='${id}']`).select2("open");
  parent.dataset.selectId = parent.children[0].name;
}
function changeSelected(id) {
  $(`[data-select='${id}']`).on("select2:close", function(e) {
    saveTextInput(e);
  });
}
if (document.querySelector("[data-smeta-item]")) {
  changeSelected();
}
function inintSelect2(id) {
  $(".select2-unit").select2({
    placeholder: "",
    allowClear: true,
    dropdownCssClass: "select-unit__drop-down",
    width: "resolve",
    minimumResultsForSearch: Infinity,
    language: {
      noResults: function() {
        return "Ничего не найдено";
      }
    }
  });
  changeSelected(id);
}
function showDropDown(event) {
  const target = event.target;
  const dropDown = target.closest("[data-search-items]").querySelector(".search-position");
  if (target.value.length == 0) {
    dropDown.classList.remove("_show");
    return;
  }
  searchItems(event);
  dropDown.classList.add("_show");
}
function saveTextSearchList(event) {
  let target = event.target;
  const textDropDownItem = target.innerText;
  const parent = target.closest(".list-position__name");
  parent.innerText = textDropDownItem;
  createingHiddentInput(textDropDownItem, parent);
  event.stopPropagation();
}
function createingHiddentInput(value, parent) {
  const name = parent.dataset.name;
  const inputHidden = document.createElement("input");
  inputHidden.setAttribute("type", "hidden");
  inputHidden.value = value;
  inputHidden.name = name;
  parent.append(inputHidden);
}
function hiddenDropDown(event) {
  const target = event.target;
  const dropDown = target.closest("[data-search-items]").querySelector(".search-position");
  dropDown.classList.remove("_show");
}
function changeRole(event) {
  let target = event.target;
  const parentSelectorRole = target.closest("[data-role]");
  const currentNameRole = parentSelectorRole.querySelector(
    ".accordion__header-content"
  );
  const selectedRole = target.value;
  currentNameRole.innerText = selectedRole;
}
if (document.querySelector(".select2")) {
  $(".select2").select2({
    placeholder: "",
    allowClear: true,
    width: "resolve",
    language: {
      noResults: function() {
        return "Ничего не найдено";
      }
    }
  });
}
if (document.querySelector(".select2-defualt")) {
  $(".select2-defualt").select2({
    minimumResultsForSearch: Infinity,
    // Отключаем поиск
    placeholder: "",
    allowClear: true,
    width: "resolve",
    language: {
      noResults: function() {
        return "Ничего не найдено";
      }
    }
  });
}
if (document.querySelector(".select2-stamp")) {
  $(".select2-stamp").select2({
    minimumResultsForSearch: Infinity,
    placeholder: "",
    dropdownCssClass: "select-stamp__drop-down",
    allowClear: true,
    width: "resolve",
    language: {
      noResults: function() {
        return "Ничего не найдено";
      }
    }
  });
}
if (document.querySelector("#reservation")) {
  $("#reservation").daterangepicker({
    singleDatePicker: true,
    autoApply: true,
    minYear: 1901,
    maxYear: parseInt(moment().format("YYYY"), 10),
    locale: {
      format: "DD.MM.YYYY",
      separator: " - ",
      daysOfWeek: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
      monthNames: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь"
      ],
      firstDay: 1
    }
  });
}
function generateRandomId() {
  return "id-" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}
if (document.querySelector("#tableUser")) {
  if (!$.fn.DataTable.isDataTable("#tableUser")) {
    $("#tableUser").DataTable({
      dom: "f",
      paging: true,
      pageLength: 25,
      searching: true,
      ordering: true,
      info: false,
      autoWidth: false,
      responsive: true,
      rowId: function(a) {
        return generateRandomId();
      },
      columnDefs: [
        { className: "_edit", targets: 0 },
        { className: "_edit", targets: 2 },
        { className: "_edit", targets: 3 }
      ],
      language: {
        search: "",
        zeroRecords: "Совпадений не найдено",
        emptyTable: "Таблица пустая",
        searchPlaceholder: "Поиск",
        paginate: {
          first: "Первая",
          previous: " ",
          next: " ",
          last: "Последняя"
        }
      }
    });
  }
}
if (document.querySelector("#tablePriceList")) {
  let creatingItemPL = function() {
    const createModal = document.getElementById("modal-create-position");
    const itemEdit = createModal.querySelectorAll("._edit-input");
    const arrData = collectInputData(itemEdit);
    const obgСategoryClass2 = {
      Мат: "_mat-category",
      Раб: "_rab-category",
      Мех: "_meh-category",
      Док: "_doc-category"
    };
    let isValidate = validateEmpty(itemEdit);
    if (isValidate) {
      tabel.row.add([
        "",
        `<span class='${obgСategoryClass2[arrData[0]]}'>${arrData[0]}</span>`,
        "",
        `${arrData[1]}`,
        `${arrData[2]}`,
        `${arrData[3]}`,
        "<td><button type='button' onclick='editPositionPriceList(event)' data-toggle='modal' data-target='#modal-edit-position' class='btn-edit'></button></td>",
        "<button type='button' onclick='deleteItemPL(event)' class='btn-del-small'>"
      ]).draw();
      $("#modal-create-position").modal("hide");
    }
  }, deleteItemPL = function(event) {
    let target = event.target;
    tabel.row($(target).parents(target)).remove().draw();
  }, clearInputPL = function() {
    const createModal = document.getElementById("modal-create-position");
    const itemEdit = createModal.querySelectorAll(".block-item > div");
    itemEdit.forEach((el, indx) => {
      const input = el.querySelector("._edit-input");
      if (indx === 0) {
        $("[name='Категория']").val("").trigger("change");
      } else if (indx === 2) {
        $("[name='Единица измерения']").val("-").trigger("change");
      } else {
        input.classList.remove("_error");
        input.value = "";
      }
    });
  };
  var creatingItemPL2 = creatingItemPL, deleteItemPL2 = deleteItemPL, clearInputPL2 = clearInputPL;
  var tabel;
  if (!$.fn.DataTable.isDataTable("#tablePriceList")) {
    tabel = $("#tablePriceList").DataTable({
      dom: "ftp",
      paging: true,
      pageLength: 25,
      searching: true,
      ordering: true,
      info: false,
      autoWidth: false,
      responsive: true,
      language: {
        search: "",
        zeroRecords: "Совпадений не найдено",
        emptyTable: "Таблица пустая",
        searchPlaceholder: "Поиск",
        paginate: {
          first: "Первая",
          previous: " ",
          next: " ",
          last: "Последняя"
        }
      },
      // columnDefs: [{ orderable: false, targets: [6, 7] }],
      rowId: function(a) {
        return generateRandomId();
      },
      columnDefs: [
        { orderable: false, targets: [6, 7] },
        {
          targets: 0,
          // Первый столбец для нумерации
          orderable: true,
          // Отключаем сортировку для этого столбца
          searchable: false,
          // Отключаем поиск для этого столбца
          render: function(data, type, row, meta) {
            return meta.row + 1;
          }
        },
        { className: "_edit", targets: 1 },
        { className: "_edit", targets: 3 },
        { className: "_edit", targets: 4 },
        { className: "_edit", targets: 5 }
      ]
    });
  }
  window.creatingItemPL = creatingItemPL;
  window.deleteItemPL = deleteItemPL;
  window.clearInputPL = clearInputPL;
}
function searchItems(event) {
  let target = event.target;
  const parentSearchSelector = target.closest("[data-search-items]");
  const input = target;
  const ul = parentSearchSelector.querySelector("[data-search-items] > ul");
  const li = ul.querySelectorAll("li");
  const filter = input.value.toLowerCase();
  if (filter === "") {
    li.forEach((it) => {
      if (it.matches("._not-found")) {
        it.remove();
      }
      it.style.display = "";
    });
  }
  if (input && input.value) {
    li.forEach((item) => {
      if (item.textContent.toLowerCase().includes(filter)) {
        item.style.display = "";
        if (document.querySelector("._not-found")) {
          document.querySelector("._not-found").remove();
        }
      } else if (item.matches("._not-found")) ;
      else {
        item.style.display = "none";
      }
    });
    const IsNotFoundLi = Array.from(li).every((li2) => {
      if (li2.style.display === "none") return true;
    });
    if (IsNotFoundLi) {
      const li2 = document.createElement("li");
      li2.classList.add("_not-found");
      li2.innerText = "Ничего не найдено";
      ul.append(li2);
    }
  }
}
function createFolder(event) {
  const modal = document.querySelector("#modal-create-folder");
  const input = modal.querySelector("._edit-input");
  const block = document.querySelector("[data-search-items]");
  const ul = block.querySelector("ul");
  const IsValidate = validateEmpty([input]);
  if (IsValidate) {
    ul.insertAdjacentHTML(
      "afterbegin",
      `<li class="_icon-folder ">
							<a href="./template-page.html" class="flex-fill "  data-name-il> ${input.value}</a>
              <span>12.12.2024</span>
							<div class="search-items__btn-dropdown dropdown-search">
								<button type="button" class="dropdown-search__btn" data-toggle="dropdown" aria-expanded="true">
								</button>
								<div class="dropdown-menu " x-placement="bottom-start">
						    <button type="button" class="dropdown-item" data-toggle="modal"
										data-target="#modal-edit-folder" onclick='getNameItemList(event)'>Редактировать</button>
									<button type="button" class="dropdown-item" onclick="deleteItemList(event)">Удалить</button>
								</div>
							</div>
						</li>`
    );
    $("#modal-create-folder").modal("hide");
  }
}
function deleteItemList(event) {
  let target = event.target;
  const li = target.closest("li");
  li.remove();
}
function getNameItemList(event) {
  let target = event.target;
  const li = target.closest("li");
  li.dataset.edit = "acitive";
  const nameFolder = li.querySelector("[data-name-il]");
  const modal = document.querySelector("#modal-edit-folder");
  const input = modal.querySelector("._edit-input");
  input.value = nameFolder.innerText;
}
function saveEditFolder(event) {
  const modal = document.querySelector("#modal-edit-folder");
  const input = modal.querySelector("._edit-input");
  const block = document.querySelector("[data-search-items]");
  const ul = block.querySelector("ul");
  const editLi = ul.querySelector("[data-edit]");
  const IsValidate = validateEmpty([input]);
  if (IsValidate) {
    editLi.querySelector("[data-name-il]").innerText = input.value;
    editLi.removeAttribute("data-edit");
    $("#modal-edit-folder").modal("hide");
  }
}
window.creatingSmeta = creatingSmeta;
window.creatingStages = creatingStages;
window.creatingPosition = creatingPosition;
window.editTextSelect = editTextSelect;
window.showDropDown = showDropDown;
window.saveTextSearchList = saveTextSearchList;
window.toggleBulkActionBar = toggleBulkActionBar;
window.chooseAllCheckbox = chooseAllCheckbox;
window.deleteSelectedItems = deleteSelectedItems;
window.deleteItem = deleteItem;
window.searchItems = searchItems;
window.hiddenDropDown = hiddenDropDown;
window.saveTextInput = saveTextInput;
window.editTextInput = editTextInput;
window.editPositionPriceList = editPositionPriceList;
window.saveEditPositionPriceList = saveEditPositionPriceList;
window.getCurrentDataClient = getCurrentDataClient;
window.saveEditClient = saveEditClient;
window.changeRole = changeRole;
window.createFolder = createFolder;
window.deleteItemList = deleteItemList;
window.getNameItemList = getNameItemList;
window.saveEditFolder = saveEditFolder;
