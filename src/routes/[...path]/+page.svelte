{#if errorMessage!=''}
<div class="alert alert-danger" role="alert">
    {errorMessage}
</div>
{/if}

<div class="component d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-1">
    {#if loadingData}
    <h5>{utils.getLabel('loading',labels,language)}</h5>
    {:else if dashboardConfig ==null || dashboardConfig.title==undefined }
    <h5>{utils.getLabel('notfound',labels,language)}</h5>
    {:else}
    <h5>{dashboardConfig.title}</h5>
    {#if isMobile}
    <i class="bi bi-phone-fill h5 me-2 link-dark" on:click="{switchMobile}"></i>
    {:else}
    <i class="bi bi-phone h5 me-2 link-dark" on:click="{switchMobile}"></i>
    {/if}
    <span class="badge rounded-pill text-bg-light h5 me-2">{secondsToRefresh}</span>
    {/if}
    {#if additionalFeatures}
    <span>
        <a title={utils.getLabel('refresh',labels,language)} on:click={refreshView}><i
                class="bi bi-arrow-clockwise h5 me-2 link-dark"></i></a>
        <a title={utils.getLabel('filter',labels,language)} data-bs-toggle="modal" data-bs-target="#filterModal"
            on:click|preventDefault={setFilter}>
            {#if isFilterSet(dashboardFilter)}
            <i class="bi bi-funnel-fill h5 me-2 link-dark"></i>
            {:else}
            <i class="bi bi-funnel h5 me-2 link-dark"></i>
            {/if}
        </a>
    </span>
    {/if}
</div>
<div class="dashboard-container" id={dashboardId}>
    {#if loadingData}
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
    {:else if dashboardConfig ==null || dashboardConfig.title==undefined || items.length==0}
    <div class="alert alert-light mx-auto my-auto">{utils.getLabel('empty',labels,language)}</div>
    {:else}
    <div class="row h-100">
        <div class="{numberOfGridCols}">
            <Grid gap={[2,2]} bind:items={items} rowHeight={100} let:item {cols} let:index on:resize={handleResize}
                on:mount={handleMount}>
                <div class={getBorderClass(index)}>
                    {#if !isRoleOK(index)}
                    <div class="alert alert-light mx-auto my-auto">{utils.getLabel('hidden',labels,language)}</div>
                    {:else}
                    {#if 'chartjs'===getWidgetType(index)}
                    <ChartjsWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
                    {:else if 'canvas'===getWidgetType(index)}
                    <CanvasWidgetExample index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'canvas_placeholder'===getWidgetType(index)}
                    <CanvasWidgetExample index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'chart_placeholder'===getWidgetType(index)}
                    <ChartjsWidgetExample index={index} bind:config={items} bind:filter={dashboardFilter} />
                    {:else if 'symbol'===getWidgetType(index)}
                    <SymbolWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'text'===getWidgetType(index)}
                    <TextWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'image'===getWidgetType(index)}
                    <ImageWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'link'===getWidgetType(index)}
                    <InternalLink bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'led'===getWidgetType(index)}
                    <LedWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'raw'===getWidgetType(index)}
                    <RawDataWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'plan'===getWidgetType(index)}
                    <PlanWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'report'===getWidgetType(index)}
                    <ReportWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'map'===getWidgetType(index)}
                    <MapWidget index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'multimap'===getWidgetType(index)}
                    <GroupMapWidget index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'multitrack'===getWidgetType(index)}
                    <TracksWidget index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {:else if 'chart'===getWidgetType(index)}
                    <ChartWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'groupchart'===getWidgetType(index)}
                    {#if 'doughnut'===getWidgetChartType(index)}
                    <DoughnutWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else if 'stacked'===getWidgetChartType(index)}
                    <StackedBarWidget bind:config={dashboardConfig.widgets[index]} bind:filter={dashboardFilter} />
                    {:else}
                    <CanvasWidgetExample index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {/if}
                    {:else}
                    <CanvasWidgetExample index={index} bind:config={dashboardConfig.widgets[index]}
                        bind:filter={dashboardFilter} />
                    {/if }
                    {/if}<!-- isRoleOK -->
                </div>
            </Grid>
        </div>
        {#if isMobile}
        <div class="col-1 d-block bg-secondary bg-opacity-25"></div>
        {/if}
    </div>
    {/if}
</div>
<!-- Filter modal -->
<div class="modal fade" id="filterModal" tabindex="0" role="dialog" aria-labelledby="filterModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalLabel">{utils.getLabel('filter',labels,language)}</h5>
            </div>
            <div class="modal-body">
                <DashboardFilterForm bind:config={editedFilter} callbackSave={filterFormCallback}
                    callbackCancel={filterFormCallbackCancel} />
            </div>
        </div>
    </div>
</div>
<script>
    import { onMount, beforeUpdate, afterUpdate, tick } from 'svelte';
    import Grid from "svelte-grid";
    import gridHelp from "svelte-grid/build/helper/index.mjs";
    import { dev } from '$app/environment';
    import { utils } from '$lib/utils.js';
    import { goto, afterNavigate, beforeNavigate } from '$app/navigation';
    import { invalidateAll } from '$app/navigation';
    import { token } from '$lib/usersession.js';
    import { page } from '$app/stores';

    import DashboardFilterForm from '$lib/components/DashboardFilterForm.svelte';
    import DashboardLinkForm from '$lib/components/DashboardLinkForm.svelte';
    import CanvasWidgetExample from '$lib/components/widgets/CanvasWidgetExample.svelte';
    import ChartjsWidgetExample from '$lib/components/widgets/ChartjsWidgetExample.svelte';
    import SymbolWidget from '$lib/components/widgets/SymbolWidget.svelte';
    import TextWidget from '$lib/components/widgets/TextWidget.svelte';
    import ImageWidget from '$lib/components/widgets/ImageWidget.svelte';
    import LedWidget from '$lib/components/widgets/LedWidget.svelte';
    import InternalLink from '$lib/components/widgets/InternalLink.svelte';
    import RawDataWidget from '$lib/components/widgets/RawDataWidget.svelte';
    import ChartWidget from '$lib/components/widgets/ChartWidget.svelte';
    import PlanWidget from '$lib/components/widgets/PlanWidget.svelte';
    import DoughnutWidget from '$lib/components/widgets/DoughnutWidget.svelte';
    import StackedBarWidget from '$lib/components/widgets/StackedBarWidget.svelte';
    import ReportWidget from '$lib/components/widgets/ReportWidget.svelte';
    import MapWidget from '$lib/components/widgets/MapWidget.svelte';
    import GroupMapWidget from '$lib/components/widgets/GroupMapWidget.svelte';
    import TracksWidget from '$lib/components/widgets/TracksWidget.svelte';

    let loadingData = true
    let data = { items: [] }
    $: dashboardConfig = data
    $: items = data.items
    let sessionToken = ''
    let refreshing = false

    let additionalFeatures = false
    const defaultInterval = 60
    let secondsToRefresh = defaultInterval

    let language = 'en'
    let errorMessage = ''
    let dashboardId = 'dashboard' + 0 //TODO
    let numberOfCols = 1

    let { item } = gridHelp;

    let editable = false; // set to true to enable editing
    let dashboardFilter = { from: '', to: '' }
    let editedFilter = { from: '', to: '' }

    let applications = [
        {
            id: 0,
            organization: 0,
            version: 0,
            name: "system",
            configuration: "{\"refreshInterval\":7}",
        }
    ]

    let isMobile = false
    let numberOfGridCols
    $: if(isMobile){
        numberOfGridCols = 'col-11'
    }else{
        numberOfGridCols = 'col-12'
    }

    // Documentation of cols
    // https://github.com/vaheqelyan/svelte-grid/issues/140
    let cols = {}

    let getBorderClass = function (idx) {
        try {
            if (dashboardConfig.widgets[idx].type == 'link') {
                return 'dashboard-widget content bg-white display'
            } else {
                return 'dashboard-widget content bg-white display h-100 border border-primary rounded-1'
            }
        } catch (e) {
            return ''
        }
    }

    let getWidgetType = function (idx) {
        try {
            return dashboardConfig.widgets[idx].type
        } catch (e) {
            return 'unknown'
        }
    }
    let getWidgetChartType = function (idx) {
        try {
            if ('chart' === dashboardConfig.widgets[idx].type || 'groupchart' === dashboardConfig.widgets[idx].type) {
                console.log('chartType', dashboardConfig.widgets[idx].chartType)
                return dashboardConfig.widgets[idx].chartType
            } else {
                return 'unknown'
            }
        } catch (e) {
            return 'unknown'
        }
    }

    // check if user has role to see widget
    let isRoleOK = function (index) {
        let userRoles = []
        /*         try {
                    userRoles = $profile.role.split(',')
                } catch (e) {
                } */
        let widgetRoles = []
        try {
            widgetRoles = dashboardConfig.widgets[index].role.split(',')
        } catch (e) {
            //console.log(e)
        }
        console.log('userRoles', userRoles)
        console.log('widgetRoles', widgetRoles)
        // remove empty roles
        widgetRoles = widgetRoles.filter(function (entry) { return entry.trim() != ''; });
        if (widgetRoles.length == 0) {
            return true
        }
        for (let role of widgetRoles) {
            if (userRoles.includes(role)) {
                return true
            }
        }
        return false
    }

    let getRefreshInterval = function () {
        let interval = dev ? 10 : defaultInterval
        if (dashboardConfig == null || dashboardConfig == undefined) {
            interval = 10 * 24 * 60 * 60
        }
        return interval * 1000 // in ms
    }

    let show = function () {
        //dashboardConfig = data
        //blockChanges(dashboardConfig)
        mergeConfigs()
        //console.log('dashboardConfig ', dashboardConfig)
        if (dashboardConfig != null && dashboardConfig.items != undefined) {
            items = dashboardConfig.items
        }

        cols = [
            [800, 10],
            [500, 1],
        ];
    }

    let mergeConfigs = function () {
    }

    //let interval

    afterNavigate(({ from, to }) => {
        console.log('afterNavigate', from, to);
        if (!dev) {
            //applications = getApplications()
        }
        loadDashboardConfig()
        console.log('data', data)
        //clearInterval(interval);
        //clearInterval(interval2);
        //interval = setInterval(() => {
        //    refreshView()
        //}, getRefreshInterval());
    })
    beforeNavigate(({ from, to }) => {
        console.log('beforeNavigate', from, to);
        //clearInterval(interval);
    })
    onMount(() => {
        const interval2 = setInterval(() => {
            secondsToRefresh = secondsToRefresh - 1
            if (secondsToRefresh == 0) {
                refreshView()
            }
        }, 1000);
        return () => {
            clearInterval(interval2);
        };
    });

    const handleResize = (event) => {
        numberOfCols = event.detail.cols
    }

    const handleMount = (event) => {
        numberOfCols = event.detail.cols
    }

    let setFilter = function (event) {
        //editedFilter.from = utils.getLocalDateFormat(dashboardFilter.from)
        //editedFilter.to = utils.getLocalDateFormat(dashboardFilter.to)
    }
    let showLink = function (event) {
        // do nothing
    }

    function refreshView() {
        refreshing = true
        console.log('refreshing', refreshing)
        invalidateAll()
        show()
        secondsToRefresh = getRefreshInterval() / 1000
    }

    function filterFormCallback(cfg) {
        dashboardFilter.from = utils.getDateApiISOFormat(cfg.from)
        dashboardFilter.to = utils.getDateApiISOFormat(cfg.to)
        editedFilter = { from: cfg.from, to: cfg.to }
    }
    function filterFormCallbackCancel() {
        editedFilter = { from: '', to: '' }
    }
    let isFilterSet = function (filter) {
        return filter.from != '' || filter.to != ''
    }
    function linkFormCallback() {
        // do nothing
    }
    const touchScrollAllow = async () => {
        await tick()
        //for (let elm of document.querySelectorAll('.svlt-grid-item'))
        for (let elm of document.querySelectorAll('.dashboard-widget'))
            elm.style.touchAction = 'auto'
    }

    afterUpdate(() => {
        touchScrollAllow()
    })

    let labels = {
        'loading': {
            'pl': "Pobieranie danych...",
            'en': "Loading data..."
        },
        'refresh': {
            'pl': "Odśwież",
            'en': "Refresh"
        },
        'filter': {
            'pl': "Filtr danych pulpitu",
            'en': "Dashboard data filter"
        },
        'configure': {
            'pl': "Konfiguracja pulpitu",
            'en': "Dashboard configuration"
        },
        'link': {
            'pl': "Link do pulpitu",
            'en': "Dashboard link"
        },
        'denied': {
            'pl': "Nie jesteś zalogowany lub nie masz uprawnień do oglądania tej strony.",
            'en': "You are not logged in or you do not have permission to view this page."
        },
        'fetcherror': {
            'pl': "Błąd pobierania danych: ",
            'en': "Fetch error: "
        },
        'fetcherror_message': {
            'pl': " Możliwa przyczyna: sertyfikaty self signed nie są obsługiwane.",
            'en': " Possible cause: self signed certificates are not supported."
        },
        'empty': {
            'pl': "Nie znaleziono definicji pulpitu lub brak zdefiniowanych kontrolek.",
            'en': "No dashboard definition found or no widgets defined."
        },
        'hidden': {
            'pl': "ukryte (brak uprawnień)",
            'en': "hidden (no permissions)"
        },
        'notfound': {
            'pl': "Nie znaleziono pulpitu",
            'en': "Dashboard not found"
        },
    }

    function loadDashboardConfig() {
        var tokenObject;
        let serviceUrl = utils.getBackendUrl(location)
        console.log('page', $page);
        // Call the API - get the token object
        token.set($page.params.path)
        fetch(serviceUrl + '/api/auth/token/' + $page.params.path).then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }).then(function (data) {
            // Store the token data to a variable
            tokenObject = data;
            const headers = new Headers()
            headers.set('Authentication', tokenObject.token);
            // Fetch user data
            //return fetch(serviceUrl +'/api/auth/v2/'+ tokenObject.token, { headers: headers });
            return fetch(serviceUrl + '/api/core/v2/dashboards/' + tokenObject.payload, { headers: headers });
        }).then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }).then(function (dashboardConfig) {
            console.log('last step result:', tokenObject, dashboardConfig);
            data = transform(dashboardConfig);
            show()
            return data;
        }).catch(function (error) {
            loadingData = false
            console.warn(error);
        });
    }

    function transform(cfg) {
        console.log('transform', cfg);
        for (let i = 0; i < cfg.items.length; i++) {
            let item = cfg.items[i]
            if (item['1'] !== null) {
                item['1'] = item['_el1']
                delete item['_el1']
            }
            if (item['10'] !== null) {
                item['10'] = item['_el10']
                delete item['_el10']
            }
        }
        cfg.items.forEach(function (item) {
            item[1].draggable = false
            item[1].resizable = false
            item[10].draggable = false
            item[10].resizable = false
        })
        loadingData = false
        return cfg
    }

    let getRightPadding = function(){
        return 'me-3'
    }

    let switchMobile = function(){
        isMobile = !isMobile
        refreshView()
    }

</script>
<style>
    .dashboard-widget {
        height: 100%;
        width: 100%;
        display: flex;
    }

    .dashboard-container {
        max-width: 1500px;
        width: 100%;
    }
</style>