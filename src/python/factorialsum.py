# -*- coding: utf-8 -*-
"""
Created on Thu Sep 24 21:42:14 2015

@author: skumar311
"""



def sumFactorial(data):
    a = data['a']
    b = data['b']
    return factorial(a) + factorial(b)

def factorial(a):
    if a == 1:
        return 1
    
    return a*factorial(a-1)