<script lang="ts">
    import {onMount} from 'svelte';
    import {storage} from "../assets/storage";
    import {UPDATED_AT_KEY, BASE_URL, BASE_CURRENCY, DAY_MILLISECONDS} from "../assets/consts";
    import {getCurrencies} from "../assets/requests";
    import {CURRENCIES} from "../assets/currencies";
    import type {BadResponseInterface, SuccessResponseInterface} from "../interfaces/response-interfaces";

    let sourceCurrency: string = 'USD';
    let targetCurrency: string = 'RUB';
    let amount: string | number = '0';
    let currencyData: BadResponseInterface | SuccessResponseInterface | null;

    onMount(async () => {
        currencyData = storage.get(BASE_CURRENCY);
        if(currencyData === null) {
            try {
                console.log('request to ExchangeRate-API');
                let data: SuccessResponseInterface | BadResponseInterface = await getCurrencies(BASE_URL + BASE_CURRENCY);
                storage.set(BASE_CURRENCY, data);
                storage.set(UPDATED_AT_KEY, Date.now())
                console.log(data);
            }
            catch (e) {
                console.warn(e);
                currencyData = {result: 'error', "error-type": 'Ошибка при выполнении запроса. Подробнее см. в консоли'};
            }
        } else {
            const updatedAt = storage.get(UPDATED_AT_KEY);
            if(updatedAt !== null) {
                let nextUpdate = new Date((storage.get(UPDATED_AT_KEY) + DAY_MILLISECONDS) - Date.now());
                if(Date.now() > (storage.get(UPDATED_AT_KEY) + DAY_MILLISECONDS)) {
                    console.log('request to ExchangeRate-API');
                    let data: SuccessResponseInterface | BadResponseInterface = await getCurrencies(BASE_URL + BASE_CURRENCY);
                    storage.set(BASE_CURRENCY, data);
                    storage.set(UPDATED_AT_KEY, Date.now());
                    console.log(data);
                }
                console.log('До обновления данных ' + nextUpdate.getUTCHours() + ' часа');
            }
        }
        currencyData = storage.get(BASE_CURRENCY);
        let hours = new Date(Date.now()).getUTCHours();
        if(hours === 1) {
            let data: SuccessResponseInterface | BadResponseInterface = await getCurrencies(BASE_URL + BASE_CURRENCY);
            storage.set(BASE_CURRENCY, data);
            console.log(data);
        }
        // if(currencyData?.result === 'success') {
        //     if(currencyData.time_next_update_unix < Number((Date.now()/1000).toFixed(0))) {
        //         let data: SuccessResponseInterface | BadResponseInterface = await getCurrencies(BASE_URL + BASE_CURRENCY);
        //         storage.set(BASE_CURRENCY, data);
        //         console.log(data);
        //     }
        //     console.log('обновление через ' + (currencyData.time_next_update_unix - Number((Date.now()/1000).toFixed(0))))
        // }
    });

    let onAmountInput = () => {
        // amount = Math.abs(Number(amount))
        // console.log(currencyData[sourceCurrency])
    }
</script>

<div class="layout">
    <div class="form--container">
        <span class="form--header">Форма конвертации валют</span>
        <div class="form--item--input-container">
            <span>Исходная валюта</span>
<!--            <input class="form&#45;&#45;item">-->
            <select class="input form--item" required bind:value={sourceCurrency}>
                {#each CURRENCIES as currency (currency.code)}
                    <option value="{currency.code}">{currency.ru_name}</option>
                {/each}
            </select>
        </div>
        <div class="form--item--input-container">
            <span>Целевая валюта</span>
            <select class="input form--item" required bind:value={targetCurrency}>
                {#each CURRENCIES as currency (currency.code)}
                    <option value="{currency.code}">{currency.ru_name}</option>
                {/each}
            </select>
        </div>
        <div class="form--item--input-container">
            <span>Количество</span>
            <input
                    class="form--item"
                    type="number"
                    pattern="\d+"
                    min="0"
                    bind:value={amount}
                    on:input={onAmountInput}>
        </div>
        <span>
            {#if currencyData && currencyData.result === 'success'}
                {amount} {sourceCurrency}
                <b>=</b>
                {Number(1 / currencyData.rates[sourceCurrency] * currencyData.rates[targetCurrency] * Number(amount)).toFixed(3)}
                {targetCurrency}
            {:else if currencyData === null}
                <span>--------------</span>
            <!--{:else}-->
            <!--    <span>{currencyData['error-type']}</span>-->
            {/if}
        </span>
    </div>
</div>

<style>
.layout {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.form--container {
    width: 500px;
    min-height: 250px;
    height: auto;
    border: 1px solid #39516E;
    border-radius: 10px;
    background-color: #2F343F;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 10px;
    box-shadow: 0 0 40px #39516E;
    overflow-x: clip;
    /*animation: form--container 8s linear infinite;*/
}
/*@keyframes form--container {*/
/*    0% {box-shadow: 0 0 20px #39516E;}*/
/*    50% {box-shadow: 0 0 50px #39516E;}*/
/*    100% {box-shadow: 0 0 20px #39516E;}*/
/*}*/
.form--header {
    font-size: 22px;
    color: #c2c2c2;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    text-align: left;
    /*flex-grow: 1;*/
    margin-top: 20px;
    margin-bottom: 20px;
}
.form--item {
    margin: 10px;
}
.form--item--input-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 90%;

}
select {
    width: 50%;
    margin-right: 11px;
    height: 35px !important;
}
input {
    width: 49%;
}
input, select {
    outline: none;
    background-color: #111;
    border: 1px solid #262B33;
    border-radius: 3px;
    color: #929292;
    font-family: arial,sans-serif;
    font-size: 15px;
    line-height: 30px;
    min-height: 30px;
    height: 30px;
    min-width: 30px;
    transition: all .3s;
    box-shadow: none;
}
input {
    text-indent: 10px;
}
input:hover, select:hover {
    border-color: #39516E;
}
input:focus, select:active {
    border-color: #ADD8E6;
    background-color: #262B33;
    color: #c2c2c2;
}
input:disabled, select:disabled {
    border-color: #2F343F;
    background-color: #262B33;
    color: #39516E;
    user-select: none;
}
</style>