jQuery(document).ready(function($) {

    $(function() {
        FastClick.attach(document.body);
    });


    // создаем канвас
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var width = ($(window).height() > $(window).width()) ?
        ($(window).width() - 50) :
        ($(window).height() - 50);

    canvas.width = width;
    canvas.height = width;
    document.getElementById('myChart').appendChild(canvas);

    var chart = new Chart(ctx);


    // форматирование даты
    function formatDate(month) {

        var date = new Date();

        if(month!==undefined)
            date.setMonth(-1);

        var dd = date.getDate();
        if (dd < 10) dd = '0' + dd;

        var mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;

        var yy = date.getFullYear();

        return yy + '-' + mm + '-' + dd;
    }

    // навигация
    $('.nav-btn').click(function() {
        var id = this.id;

        $('.nav-btn').removeClass('active');
        $(this).addClass('active');

        $('.page').hide();
        $('#' + id + '-page').show();

        return false;
    });

    // календарь
    $('.date').datepicker({
        showOn: "button",
        buttonImage: "img/calendar.png",
        buttonImageOnly: true,
        regional: 'ru',
        dateFormat: 'yy-mm-dd'
    });


    $('.date').val(formatDate());
    $('.date_ot').val(formatDate(true));



    /// //// // // // //
    // localstorage
    if (!br.storage.get('plans')) {
        br.storage.set('plans', {});
    }
    if (!br.storage.get('flow')) {
        br.storage.set('flow', {});
    }


    // br.storage.set('plans', {"1": {"name": "Мото", "money": 150000, "nead": 300000, "percent": 50 }, "2": {"name": "Дом", "money": 1000, "nead": 3000000, "percent": 0 } });


    /*     groups     */
    var groups = {
        "g1": {
            "name": "Благотворительность"
        },
        "g2": {
            "name": "Сбережения"
        },
        "g3": {
            "name": "Налоги"
        },
        "g4": {
            "name": "Расходы на жизнь(кварплата и т.д.)"
        },
        "g5": {
            "name": "Хозяйственные нужды(еда, одежда и т.д.)"
        },
        "g6": {
            "name": "Транспорт"
        },
        "g7": {
            "name": "Досуг / Отдых"
        },
        "g8": {
            "name": "Страхование"
        },
        "g9": {
            "name": "Долги / Разное"
        },
        "g10": {
            "name": "Деловые расходы"
        }
    };

    var opt = '';
    $.each(groups, function(i, v) {
        opt += '<option value="' + i + '">' + v.name + '</option>';
    });

    $('#groups').html(opt);


    /*     plans     */
    var planning = function() {
        var plans = br.storage.get('plans');

        var plan_list = '',
            opt = '';
        $.each(plans, function(i, v) {
            opt += '<option value="' + i + '">' + v.name + ' (' + v.percent + '%)' + '</option>';
            plan_list += '<li class="topcoat-list__item">' + v.name + ' (' + v.percent + '%)<span class="del-plan" id="' + i + '">X</span> <small>' + v.money + ' / ' + v.nead + '</small></li>';
        });
        $('#plans').html(opt);
        $('#plans-list').html(plan_list);

        $(".del-plan").off('click').on("click", function() {
            if (confirm('Удалить этот план?'))
                delPlan(this.id);
        });
    };

    planning();

    var delPlan = function(id) {
        var plans = br.storage.get('plans');
        delete plans[id];
        br.storage.set('plans', plans);
        planning();
    };

    var percent = function(nead, now) {
        if (!now) now = 0;
        return parseInt(int(now) / (int(nead) / 100), 10);
    };


    var int = function(i) {
        i += '';
        return parseInt(i.replace(/\D+/g, ""), 10);
    };

    var Color = function() {
        var rand = 1100000 + Math.random() * 14899999;
        rand = Math.round(rand);
        return '#' + (rand).toString(16);
    };



    /*   flow   */
    // сохранение расходов
    $('#save_flow').click(function() {
        var obj = {},
            flw = br.storage.get('flow'),
            time = (new Date($('#date_flow').val()).getTime() / 1000) + (Object.keys(flw).length || 0);

        obj[time] = {};

        obj[time].comment = $('#comment_flow').val();
        obj[time].date = $('#date_flow').val();
        obj[time].id = $('#category_flow').val();
        obj[time].money = $('#money_flow').val();

        // если это постоянный расход то 1 если план то 2
        if (obj[time].id.charAt(0) === 'g') {
            obj[time].category = 1;
        } else {
            obj[time].category = 2;
            var plan = br.storage.get('plans');
            // если это план, то обновляем его данные, собранные деньги и проценты
            // console.log(plan[obj[time].id]);
            plan[obj[time].id]['money'] = int(obj[time].money) + int(plan[obj[time].id]['money']);
            plan[obj[time].id]['percent'] = percent(plan[obj[time].id]['nead'], plan[obj[time].id]['money']);
            br.storage.set('plans', plan);
        }

        br.storage.extend('flow', obj);
        planning();
        $('#comment_flow, #money_flow').val('');

        alert('Данные сохранены');
    });


    /**
    Планы
    ------
    */

    // Добавить план
    $('#add-plan').click(function() {
        $('.add-plan').slideDown(500);
    });

    // сохранить план
    $('#save-plan').click(function() {
        var pl = br.storage.get('plans'),
            a_pl = Object.keys(pl),
            k = int((a_pl[a_pl.length - 1] || 0)) + 1,
            obj = {};

        obj[k] = {};
        obj[k].name = $('#name_plan').val();
        obj[k].nead = int($('#nead_plan').val());
        obj[k].money = 0;
        obj[k].percent = percent(obj[k].nead);

        br.storage.extend('plans', obj);
        planning();

        $('#name_plan, #nead_plan').val('');
        $('.add-plan').slideUp(500);
    });


    /**
    Графики
    ------------
    */


    var drawGraph = function(dt1, dt2) {
        var date1 = (new Date(dt1).getTime() / 1000) - 1000;
        var date2 = (new Date(dt2).getTime() / 1000) + 1000;

        var flow = br.storage.get('flow'),
            graph = {},
            data = [],
            list = '';

        // создаем объект из записей
        $.each(flow, function(i, v) {
            if (date1 < int(i) && int(i) < date2) {
                if (v.category === 1) {
                    if (!graph[v.id]) {
                        graph[v.id] = {};
                        graph[v.id].value = int(v.money);
                    } else {
                        graph[v.id].value += int(v.money);
                    }
                } else {
                    if (!graph['pl']) {
                        graph['pl'] = {};
                        graph['pl'].value = int(v.money);
                    } else {
                        graph['pl'].value += int(v.money);
                    }
                }
            }
        });


        // объект для графика
        $.each(graph, function(i, j) {
            var nm = (!groups[i]) ? 'Планы' : groups[i].name;

            var obj = {
                name: nm,
                value: j.value,
                color: Color()
            };

            data.push(obj);
        });

        if (Object.keys(data).length === 0) {
            alert('У вас нет записей за указанный период');
        } else {
            $.each(data, function(i, j) {
                list += '<span style="color:' + j.color + ';">' + j.name + ' (' + j.value + ')</span><br>';
            });
        }

        // var ctx = $("#myChart").get(0).getContext("2d");
        var myNewChart = chart.Pie(data);

        $('#graph-lists').html(list);
    };


    // drawGraph('2014-01-01', '2014-02-02');
    $('#show-graph').click(function() {
        drawGraph($('#date1_graph').val(), $('#date2_graph').val());
        return false;
    });



    /*  ------ */
    // document.getElementById('myChart').width = 500;

    // console.log(br.storage.get('flow'));
});