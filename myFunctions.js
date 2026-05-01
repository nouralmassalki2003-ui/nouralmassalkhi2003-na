function toggleDetails(id) { $("#" + id).toggle(); }

function showForm() {
    if ($("input[name='mealSelect']:checked").length === 0) {
        alert("الرجاء اختيار وجبة واحدة على الأقل قبل المتابعة.");
        return;
    }
    $("#orderForm").show();
    $('html, body').animate({ scrollTop: $("#orderForm").offset().top }, 400);
}

function hideForm() {
    $("#orderForm").hide();
    $("#orderForm input[type='text']").val("");
}

function hideResult() { $("#orderOverlay").hide(); }

function submitOrder() {
    var name   = $.trim($("#fullName").val());
    var bank   = $.trim($("#bankAcc").val());
    var date   = $.trim($("#orderDate").val());
    var mobile = $.trim($("#mobileNum").val());

    if (name && !/^[A-Za-z]+\s[A-Za-z]+$/.test(name))
        return fail("الاسم يجب أن يكون بالأحرف الإنكليزية فقط مع فراغ واحد بين الاسم والكنية.");
    if (!/^\d{6}$/.test(bank))
        return fail("رقم الحساب المصرفي مطلوب ويجب أن يكون 6 خانات رقمية.");
    if (date && !isValidDate(date))
        return fail("تاريخ الطلب يجب أن يكون بصيغة dd-mm-yyyy وصحيح.");
    if (mobile && !/^09[34568]\d{7}$/.test(mobile))
        return fail("رقم الموبايل يجب أن يطابق شبكة Syriatel أو MTN (مثال: 0944xxxxxx).");

    var total = 0, rows = "", i = 1;
    $("input[name='mealSelect']:checked").each(function () {
        var p = parseInt($(this).val(), 10);
        rows += "<tr><td>" + (i++) + "</td><td>" + $(this).attr("data-name") +
                "</td><td>" + p.toLocaleString() + "</td></tr>";
        total += p;
    });

    if (!total) return fail("الرجاء اختيار وجبة واحدة على الأقل.");

    var tax = total * 0.10;
    $("#resName").text(name || "-");
    $("#resBank").text(bank);
    $("#resDate").text(date || "-");
    $("#resMobile").text(mobile || "-");
    $("#resMeals").html(rows);
    $("#resTotal").text(total.toLocaleString());
    $("#resTax").text(tax.toLocaleString());
    $("#resNet").text((total + tax).toLocaleString());

    $("#orderForm").hide();
    $("#orderOverlay").fadeIn(200);
    return false;
}

function fail(msg) { alert(msg); return false; }

function isValidDate(s) {
    var m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(s);
    if (!m) return false;
    var dt = new Date(+m[3], +m[2] - 1, +m[1]);
    return dt.getDate() === +m[1] && dt.getMonth() + 1 === +m[2] && dt.getFullYear() === +m[3];
}
