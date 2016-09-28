// PH hill-climber with log tetragraph scoring
importScripts('tettable.js');

//postMessage("tet_values loaded");
var tet_table = new Array();
var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var buffer = new Array();
var plain_text = new Array();
var scoring_method = '4'; // log of standard table
//var key = new Array();
var max_trials;
var sq = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24]
];
var inv_row = [];
var inv_col = [];
var buf_len;
var noise_step, cycle_limit, begin_level;
var fudge_factor = 0.2; // for backup in case I forget to send it.

function initialize_tet_table() {
    var i, c, n, v;

    for (i = 0; i < 26 * 26 * 26 * 26; i++) {
        tet_table[i] = 0.0;
    }
    for (c in tet_values) {
        n = alpha.indexOf(tet_values[c].charAt(0)) + 26 * alpha.indexOf(tet_values[c].charAt(1)) +
            26 * 26 * alpha.indexOf(tet_values[c].charAt(2)) + 26 * 26 * 26 * alpha.indexOf(tet_values[c].charAt(3));
        v = parseFloat(tet_values[c].slice(4));
        tet_table[n] = v;
    }
    postMessage("00~tet table initialized");
}
initialize_tet_table();
max_trials = 1000000;

function put_pc(c1, c2, i1) {
    var row1, col1, row2, col2;

    row1 = inv_row[c1];
    col1 = inv_col[c1];
    row2 = inv_row[c2];
    col2 = inv_col[c2];

    if (row1 == row2) {
        plain_text[i1] = sq[row1][(col1 + 4) % 5];
        plain_text[i1 + 1] = sq[row2][(col2 + 4) % 5];
    } else if (col1 == col2) {
        plain_text[i1] = sq[(row1 + 4) % 5][col1];
        plain_text[i1 + 1] = sq[(row2 + 4) % 5][col2];
    } else {
        plain_text[i1] = sq[row1][col2];
        plain_text[i1 + 1] = sq[row2][col1];
    }
}



function get_trial_decrypt() {
    var i, j, k, index, x;
    var c1, c2, c3, c4;

    // get inverse key square
    for (i = 0; i < 5; i++)
        for (j = 0; j < 5; j++) {
            inv_row[sq[i][j]] = i;
            inv_col[sq[i][j]] = j;
        }

    for (j = 0; j < buf_len; j = j + 2) {
        c1 = buffer[j];
        c2 = buffer[j + 1];
        put_pc(c1, c2, j);
    }
}


function get_score(buf_len) {
    var score, i, n;
    var best_match, match, y;

    get_trial_decrypt();
    // get tetgraph score
    score = 0.0;
    for (i = 0; i < buf_len - 3; i++) {
        n = plain_text[i] + 26 * plain_text[i + 1] + 26 * 26 * plain_text[i + 2] + 26 * 26 * 26 * plain_text[i + 3];
        score += tet_table[n];
    }
    return (score);
}

function do_hill_climbing(str) {
    var out_str, c, n, v, score, i, j, trial;
    var n1, n2, v1, v2, max_score, current_hc_score;
    var x, y, n3, n4;
    var noise_level, cycle_numb, sq_choice, c1, c2;
    var numb_accepted;

    var s;

    str = str.toUpperCase();
    buf_len = 0;
    for (i = 0; i < str.length; i++) {
        c = str.charAt(i);
        n = alpha.indexOf(c);
        if (n >= 0) {
            buffer[buf_len++] = n;
        }
    }

    n = 0;
    for (i = 0; i < 5; i++)
        for (j = 0; j < 5; j++) {
            sq[i][j] = n++;
            if (n == 9) n++; // skip 'j'
        }
        // random start;
    for (x = 0; x < 5; x++)
        for (y = 0; y < 5; y++) {
            j = Math.floor(Math.random() * 5);
            i = Math.floor(Math.random() * 5);
            c = sq[x][y];
            sq[x][y] = sq[i][j];
            sq[i][j] = c;
        }
    cycle_limit = 20;
    begin_level = 1.0
    noise_step = 1.5;
    noise_level = begin_level;
    cycle_numb = 0;
    max_score = current_hc_score = score = get_score(buf_len);
    out_str = '0';
    x = score.toFixed(2);
    out_str += x + '~';
    for (i = 0; i < buf_len; i++) {
        out_str += alpha.charAt(plain_text[i]).toLowerCase();
    }
    out_str += "\n score of plaintext is " + score;
    postMessage(out_str);
    numb_accepted = 1;
    for (trial = 0; trial < max_trials; trial++) {
        n1 = Math.floor(Math.random() * 5);
        n2 = Math.floor(Math.random() * 5);
        n3 = Math.floor(Math.random() * 5);
        n4 = Math.floor(Math.random() * 5);
        sq_choice = Math.floor(Math.random() * 50);
        switch (sq_choice) {
            case 0: // swap rows
                for (j = 0; j < 5; j++) {
                    c = sq[n1][j];
                    sq[n1][j] = sq[n2][j];
                    sq[n2][j] = c;
                }
                break;
            case 1: // swap columns
                for (j = 0; j < 5; j++) {
                    c = sq[j][n1];
                    sq[j][n1] = sq[j][n2];
                    sq[j][n2] = c;
                }
                break;
            case 2: // left right flip
                for (j = 0; j < 5; j++) {
                    c = sq[j][0];
                    sq[j][0] = sq[j][4];
                    sq[j][4] = c;
                    c = sq[j][1];
                    sq[j][1] = sq[j][3];
                    sq[j][3] = c;
                }
                break;
            case 3: // top bottom flip
                for (j = 0; j < 5; j++) {
                    c = sq[0][j];
                    sq[0][j] = sq[4][j];
                    sq[4][j] = c;
                    c = sq[1][j];
                    sq[1][j] = sq[3][j];
                    sq[3][j] = c;
                }
                break;
            case 4: //swap rows & columns
                for (i = 0; i < 4; i++)
                    for (j = i + 1; j < 5; j++) {
                        c = sq[i][j];
                        sq[i][j] = sq[j][i];
                        sq[j][i] = c;
                    }
                break;
            default:
                /* simple pair swap */
                c1 = sq[n1][n2];
                c2 = sq[n3][n4];
                sq[n1][n2] = c2;
                sq[n3][n4] = c1;

                break;
        }

        score = get_score(buf_len);
        if (score > max_score) {
            max_score = score;
            out_str = '0'; // 0 at beginning is signal to post message in output box
            x = score.toFixed(2);
            out_str += x + '~';
            for (i = 0; i < buf_len; i++) {
                out_str += alpha.charAt(plain_text[i]).toLowerCase();
            }
            out_str += '\nKey: \n';
            for (i = 0; i < 5; i++) {
                for (j = 0; j < 5; j++) {
                    out_str += alpha.charAt(sq[i][j]);
                }
                out_str += "\n";
            }
            postMessage(out_str);
        }
        if (score > current_hc_score - fudge_factor * buf_len / (noise_level)) {
            if (score != current_hc_score) {
                numb_accepted++;
            }
            current_hc_score = score;
        } else {
            switch (sq_choice) {
                case 0: // swap rows back
                    for (j = 0; j < 5; j++) {
                        c = sq[n1][j];
                        sq[n1][j] = sq[n2][j];
                        sq[n2][j] = c;
                    }
                    break;
                case 1: // swap columns back
                    for (j = 0; j < 5; j++) {
                        c = sq[j][n1];
                        sq[j][n1] = sq[j][n2];
                        sq[j][n2] = c;
                    }
                    break;
                case 2: // left right flip
                    for (j = 0; j < 5; j++) {
                        c = sq[j][0];
                        sq[j][0] = sq[j][4];
                        sq[j][4] = c;
                        c = sq[j][1];
                        sq[j][1] = sq[j][3];
                        sq[j][3] = c;
                    }
                    break;
                case 3: // top bottom flip
                    for (j = 0; j < 5; j++) {
                        c = sq[0][j];
                        sq[0][j] = sq[4][j];
                        sq[4][j] = c;
                        c = sq[1][j];
                        sq[1][j] = sq[3][j];
                        sq[3][j] = c;
                    }
                    break;
                case 4: //swap rows & columns
                    for (i = 0; i < 4; i++)
                        for (j = i + 1; j < 5; j++) {
                            c = sq[i][j];
                            sq[i][j] = sq[j][i];
                            sq[j][i] = c;
                        }
                    break;
                default:
                    // restore pairs
                    sq[n1][n2] = c1;
                    sq[n3][n4] = c2;
                    break;
            }
        }
        noise_level += noise_step;
        if (++cycle_numb >= cycle_limit) {
            noise_level = begin_level;
            cycle_numb = 0;
        }



    } // next trial
}
onmessage = function(event) { //receiving a message with the string to decode, start hill-climbing
    var out_str, c, n, v, buf_len, score, i, j, trial;
    var n1, n2, v1, v2, max_score, current_hc_score;

    var str = event.data; // string to decode
    if (str.charAt(0) == '@') {
        s = str.split(':'); // variable values separated by colons
        max_trials = parseInt(s[0].slice(1));
        fudge_factor = parseFloat(s[1]);
        n = parseInt(s[2]);
        Math.random(n); // seed for hill-climbing
    } else {
        postMessage("1working...");
        do_hill_climbing(str);
        postMessage("1DONE"); // 1 at beginning is signal not to post in output box
    }
};