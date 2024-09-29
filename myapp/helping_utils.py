
def text_formatter(txt):
    # txt = txt.replace('\n', '<br>')
    temp =txt
    new = ''
    rep = '<h2>'
    find = False
    rep2 = '<h1>'
    i = 0
    while i < len(temp) - 2:
        if temp[i] + temp[i + 1]  == '* ':
            # Add the current header tag (<h2> or </h2>)
            new += rep2
            find = True
            # Skip the next character because we've processed both '*'
            i += 2
        
        if temp[i] == '.' and find:
                new += '</h2>'
                find = False
                i += 1
                    
        elif temp[i] + temp[i + 1] == '**':
            # Add the current header tag (<h2> or </h2>)
            new += rep
            # Alternate between opening and closing tags
            rep = '</h2>' if rep == '<h2>' else '<h2>'
            # Skip the next character because we've processed both '*'
            i += 2

        else:
            # Add the current character if it's not part of '**'
            new += temp[i]
            i += 1

    # Add the last character if it was skipped by the loop
    if i < len(temp):
        new += temp[i]

    # temp = new.replace('##', '<h2>')
    lst = list(temp.partition('<br>'))

    return lst